// 前后端交互
import request from "@/utils/request";
//列表全部部门数据
export const queryAllApi = () => request.get("/depts");
//新增部门
export const addApi = (dept) => request.post("/depts", dept);
//查询回显
export const queryInfoApi = (id) => request.get(`/depts/${id}`);
//修改部门
export const upDataDeptApi = (data) => request.put("/depts", data);
//删除部门
export const deleteDeptApi = (id) => request.delete(`/depts?id=${id}`);
