# 使用官方 Bun 镜像作为基础镜像
FROM oven/bun:1-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 bun.lockb 文件
COPY package.json bun.lockb* ./

# 安装依赖
RUN bun install --frozen-lockfile

# 复制项目源代码
COPY . .

# 暴露端口 3001（与 server.ts 中的端口一致）
EXPOSE 3001

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# 启动应用
CMD ["bun", "run", "start"]
