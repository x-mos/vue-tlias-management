// src/api/emp.js
import request from "@/utils/request";

// 查询员工列表（带分页）
// src/api/emp.js
export function queryEmpListApi(params) {
  return request({
    url: "/emps",
    method: "get",
    params,
  });
}

//添加员工
export const addEmpApi = (data) => request.post("/emps", data);
//修改员工
export const updateEmpApi = (data) => request.put("/emps", data);
//删除员工
// export const deleteEmpApi = (id) => request.delete(`/emps/${id}`);
export const deleteEmpApi = (ids) => {
  const query = ids.map((id) => `ids=${id}`).join("&");
  return request.delete(`/emps?${query}`);
};

//根据 ID 查询员工信息
export const queryEmpInfoApi = (id) => request.get(`/emps/${id}`);
//修改密码
export const updatePasswordApi = (data) =>
  request.put(`/emps/updatePassword`, data);
// 获取部门列表
export const getDeptListApi = () => request.get("/depts");
