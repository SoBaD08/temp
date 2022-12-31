import clientApi from "./clientApi";

export default {
  saveAsset(id, body) {
    let url = "/folder/:id/asset".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, body)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  getFolderInfo(id) {
    let url = "/folder/:id".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .get(url)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  deleteAsset(id, body) {
    let url = "/folder/:id/asset".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .delete(url, { data: body })
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  saveImage(id, body) {
    let url = "/folder/:id/image".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, body)
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
  saveEdited({ _id = null, images = null }) {
    let url = "/folder/images/edited";
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, { _id, images })
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    });
  },
};
