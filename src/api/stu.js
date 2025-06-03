// src/api/stu.js
import request from "@/utils/request";
// 分页查询学员列表
export const queryStudentListApi = (params) =>
  request.get("/students", { params });
// 添加学员
export const addStudentApi = (data) => request.post("/students/save", data);
// 修改学员
export const updateStudentApi = (data) => request.put("/students/update", data);
// 删除学员（单个）
export const deleteStudentApi = (id) => request.delete(`/students/deleted/${id}`);
// export const deleteStudentsApi = (ids) =>
//   request.delete("/students", { data: ids });

// 根据 ID 查询学员
export const queryStudentByIdApi = (id) => request.get(`/students/query/${id}`);

export const queryClazzListApi = () => request.get(`/clazzs`);
