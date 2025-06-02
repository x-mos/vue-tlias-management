// src/api/log.js
import request from "@/utils/request";

export const queryLogListApi = (params) => request.get("/log/page", { params });
