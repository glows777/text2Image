# 文字生成图片聊天助手

一个基于阿里云DashScope API的文字生成图片聊天应用，使用Bun + TypeScript构建代理服务器解决跨域问题。

## 🚀 快速开始

### 前置要求

1. 安装 [Bun](https://bun.sh/)
2. 获取阿里云DashScope API密钥

### 安装依赖

```bash
bun install
```

### 启动服务

```bash
# 开发模式（自动重启）
bun run dev

# 生产模式
bun run start
```

服务启动后：
- 🌐 前端页面：http://localhost:3001
- ❤️ 健康检查：http://localhost:3001/health

## 📁 项目结构

```
text2Image/
├── index.html          # 前端聊天界面
├── server.ts           # Bun + TypeScript 代理服务器
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript配置
└── README.md          # 项目说明
```

## 🔧 功能特性

### 前端功能
- 💬 现代化聊天界面（Tailwind CSS）
- 🎨 文字生成图片功能
- ⚙️ API密钥设置和管理
- 📱 响应式设计
- 🔄 实时加载状态
- 🖼️ 图片预览和全屏查看

### 后端功能
- 🔀 DashScope API代理转发
- 🌍 CORS跨域支持
- 🛡️ 错误处理和验证
- 📊 健康检查接口
- 🎯 TypeScript类型安全

## 📡 API接口

### POST /api/create-task
创建图片生成任务

**请求体：**
```json
{
  "apiKey": "your-dashscope-api-key",
  "data": {
    "model": "qwen-image",
    "input": {
      "prompt": "图片描述"
    },
    "parameters": {
      "size": "1328*1328",
      "n": 1,
      "prompt_extend": true,
      "watermark": true
    }
  }
}
```

### GET /api/task/{taskId}
查询任务状态

**请求头：**
```
Authorization: Bearer your-dashscope-api-key
```

## 🔑 使用方法

1. **启动服务器**
   ```bash
   bun run dev
   ```

2. **打开浏览器**
   访问 http://localhost:3001

3. **配置API密钥**
   - 点击右上角设置按钮
   - 输入您的DashScope API密钥
   - 点击保存

4. **开始聊天**
   - 在输入框中描述您想要的图片
   - 点击发送或按回车键
   - 等待AI生成图片

## 🛠️ 开发说明

### 环境变量（可选）
可以通过环境变量配置端口：
```bash
PORT=3001 bun run start
```

### 构建项目
```bash
bun run build
```

### 代理服务器特性
- ✅ 完整的CORS支持
- ✅ TypeScript类型检查
- ✅ 错误处理和日志
- ✅ 静态文件服务
- ✅ 健康检查端点

## 🔒 安全说明

- API密钥仅存储在用户浏览器本地
- 代理服务器不会记录或存储API密钥
- 所有请求都通过HTTPS转发到DashScope

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！
