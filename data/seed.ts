import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

import * as dotenv from 'dotenv';

// 加载项目根目录下的 .env 文件
dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log(process.env.DATABASE_URL);

// 现在你可以拿到环境变量了
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool); // 在 Prisma 7 中，需要将 adapter 传入构造函数
const prisma = new PrismaClient({ adapter });

interface SeedData {
  [modelName: string]: any[];
}

interface PrismaModelDelegate {
  createMany(args: {
    data: any[];
    skipDuplicates?: boolean;
  }): Promise<{ count: number }>;
}

async function main() {
  const dataPath = path.join(__dirname, 'db.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const seedData = JSON.parse(rawData) as SeedData;

  console.log('开始执行种子数据...');
  // 遍历 JSON 中的每个 key（表名）
  for (const [modelName, records] of Object.entries(seedData)) {
    const modelKey = modelName.charAt(0).toLowerCase() + modelName.slice(1);

    // 重点：核心修正：先转为 unknown，再转为 Record 这样 TS 就不会抱怨类型“不重叠”了
    const prismaAsRecord = prisma as unknown as Record<string, unknown>;
    const potentialModel = prismaAsRecord[modelKey];

    // 严格的类型保护
    if (
      potentialModel &&
      typeof potentialModel === 'object' &&
      'createMany' in potentialModel &&
      typeof (potentialModel as Record<string, unknown>).createMany ===
        'function'
    ) {
      // 安全地断言为模型代理
      const prismaModel = potentialModel as unknown as PrismaModelDelegate;

      console.log(`正在插入 ${modelName} 数据...`);

      try {
        await prismaModel.createMany({
          // 确保 data 是数组，防止 ESLint 报错
          data: Array.isArray(records) ? records : [],
          skipDuplicates: true,
        });
        console.log(`✅ ${modelName} 插入成功`);
      } catch (error) {
        // 处理 error 类型以符合 ESLint 规则
        const message = error instanceof Error ? error.message : String(error);
        console.error(`❌ 插入 ${modelName} 失败:`, message);
      }
    } else {
      console.warn(
        `警告：模型 ${modelName} 不存在或不支持 createMany，跳过...`,
      );
    }
  }
  console.log('种子数据执行完成！');
}
main()
  .catch((e) => {
    console.error('种子脚本出错:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
