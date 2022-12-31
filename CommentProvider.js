import clientApi from "./clientApi";

export default {
  getComment({ media, parentComment }) {
    let param = `${media ? `media=${media}` : ""}${parentComment ? `&parentComment=${parentComment}`: ""}`;
    let url = "/media-comment?" + param;
    return new Promise((resolve, reject) => {
      clientApi
        .get(url)
        .then((res) => resolve(res?.data))
        .catch((error) => reject(error));
    });
  },
  createComment(body) {
    let url = "/media-comment";
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, body)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  updateComment(id, body) {
    let url = "/media-comment/:id".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .patch(url, body)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  deleteComment(id) {
    let url = "/media-comment/:id".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .delete(url)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
};
