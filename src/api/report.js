import request from "@/utils/request";

// 员工统计
export const getEmpGenderReportApi = () => request.get("/report/empGenderData");
export const getEmpJobReportApi = () => request.get("/report/empJobData");

// 学员统计
export const getStudentDegreeDataApi = () => request.get("/report/studentDegreeData");
export const getStudentCountDataApi = () => request.get("/report/studentCountData");
