// src/api/clazz.js
import request from "@/utils/request";

// 分页查询班级列表
export const queryClazzListApi = () => request.get("/clazzs");
// 添加班级
export const addClazzApi = (data) => request.post("/clazzs", data);
// 修改班级
export const updateClazzApi = (data) => request.put("/clazzs", data);
// 删除班级
export const deleteClazzApi = (id) => request.delete(`/clazzs/${id}`);
// 根据 ID 查询班级
export const queryClazzByIdApi = (id) => request.get(`/clazzs/${id}`);
