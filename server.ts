import { serve } from "bun";

interface DashScopeRequest {
    model: string;
    input: {
        prompt: string;
    };
    parameters: {
        size: string;
        n: number;
        prompt_extend: boolean;
        watermark: boolean;
    };
}

interface ProxyRequestBody {
    apiKey: string;
    data: DashScopeRequest;
}

const DASHSCOPE_BASE_URL = "https://dashscope.aliyuncs.com/api/v1";

// CORS 头部
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    "Access-Control-Max-Age": "86400",
};

const server = serve({
    port: 3001,
    async fetch(req) {
        const url = new URL(req.url);

        // 处理 CORS 预检请求
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        // 静态文件服务 - 提供前端页面
        if (req.method === "GET" && url.pathname === "/") {
            const file = Bun.file("./index.html");
            return new Response(file, {
                headers: {
                    ...corsHeaders,
                    "Content-Type": "text/html",
                },
            });
        }

        // 健康检查接口
        if (req.method === "GET" && url.pathname === "/health") {
            return new Response(
                JSON.stringify({
                    status: "ok",
                    timestamp: new Date().toISOString(),
                    message: "DashScope proxy server is running"
                }),
                {
                    status: 200,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                }
            );
        }

        // 创建图片生成任务的代理接口
        if (req.method === "POST" && url.pathname === "/api/create-task") {
            try {
                const body = await req.json() as ProxyRequestBody;

                if (!body.apiKey) {
                    return new Response(
                        JSON.stringify({ error: "API密钥不能为空" }),
                        {
                            status: 400,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                if (!body.data) {
                    return new Response(
                        JSON.stringify({ error: "请求数据不能为空" }),
                        {
                            status: 400,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                // 转发请求到 DashScope API
                const dashScopeResponse = await fetch(
                    `${DASHSCOPE_BASE_URL}/services/aigc/text2image/image-synthesis`,
                    {
                        method: "POST",
                        headers: {
                            "X-DashScope-Async": "enable",
                            "Authorization": `Bearer ${body.apiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(body.data),
                    }
                );

                const responseData = await dashScopeResponse.json();

                return new Response(JSON.stringify(responseData), {
                    status: dashScopeResponse.status,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                });

            } catch (error) {
                console.error("Create task error:", error);
                return new Response(
                    JSON.stringify({
                        error: "服务器内部错误",
                        details: error instanceof Error ? error.message : "Unknown error"
                    }),
                    {
                        status: 500,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
        }

        // 查询任务状态的代理接口
        if (req.method === "GET" && url.pathname.startsWith("/api/task/")) {
            try {
                const taskId = url.pathname.split("/api/task/")[1];
                const apiKey = req.headers.get("Authorization")?.replace("Bearer ", "");

                if (!apiKey) {
                    return new Response(
                        JSON.stringify({ error: "缺少API密钥" }),
                        {
                            status: 401,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                if (!taskId) {
                    return new Response(
                        JSON.stringify({ error: "缺少任务ID" }),
                        {
                            status: 400,
                            headers: {
                                ...corsHeaders,
                                "Content-Type": "application/json",
                            },
                        }
                    );
                }

                // 转发请求到 DashScope API
                const dashScopeResponse = await fetch(
                    `${DASHSCOPE_BASE_URL}/tasks/${taskId}`,
                    {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${apiKey}`,
                        },
                    }
                );

                const responseData = await dashScopeResponse.json();

                return new Response(JSON.stringify(responseData), {
                    status: dashScopeResponse.status,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                });

            } catch (error) {
                console.error("Query task error:", error);
                return new Response(
                    JSON.stringify({
                        error: "服务器内部错误",
                        details: error instanceof Error ? error.message : "Unknown error"
                    }),
                    {
                        status: 500,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
        }

        // 404 处理
        return new Response(
            JSON.stringify({
                error: "接口不存在",
                path: url.pathname,
                method: req.method
            }),
            {
                status: 404,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            }
        );
    },
});

console.log(`🚀 DashScope代理服务器启动成功！`);
console.log(`📡 服务地址: http://localhost:${server.port}`);
console.log(`🌐 前端页面: http://localhost:${server.port}/`);
console.log(`❤️  健康检查: http://localhost:${server.port}/health`);
console.log(`📝 API接口:`);
console.log(`   POST /api/create-task - 创建图片生成任务`);
console.log(`   GET  /api/task/{taskId} - 查询任务状态`);
