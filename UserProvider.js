import clientApi from "./clientApi";

export default {
  userInfo() {
    let url = "/user/auth/me";
    return new Promise((resolve, reject) => {
      clientApi
        .get(url)
        .then((res) => resolve(res?.data))
        .catch((err) => reject(err));
    });
  },
  projectInfo() {
    let url = "/project";
    return new Promise((resolve, reject) => {
      clientApi
        .get(url)
        .then((res) => resolve(res?.data))
        .catch((err) => reject(err));
    });
  },
  getAllMember(id){
    let url = "/project/:id/member/all".replace(":id",id);
    return new Promise((resolve, reject) => {
      clientApi
        .get(url)
        .then((res) => resolve(res?.data))
        .catch((err) => reject(err));
    });
  }
};
