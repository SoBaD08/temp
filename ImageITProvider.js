import clientApi from "./clientApi";
import { clientApiFile } from "./clientApi";

export default {
  remove({
    mediaId = null,
    maskMediaId = null,
    blocks = null,
    fileset = null,
  }) {
    let url = "/ai/remove-object";
    let body = blocks
      ? {
          mediaId,
          blocks,
          fileset,
        }
      : {
          mediaId,
          maskMediaId,
          fileset,
        };
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, body)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  postFileImage({
    file = null,
    application = null,
    model = null,
    data = null,
  }) {
    let url = "/media";
    let body = model
      ? {
          file: file,
          mimeType: "image",
          modelType: "Folder",
          application: application,
          model: model,
        }
      : {
          file: file,
          mimeType: "image",
          modelType: "Project",
          application: "thumbnail",
        };
    if (data) {
      body.data = data;
    }
    return new Promise((resolve, reject) => {
      clientApiFile
        .post(url, body)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  getMedia(size = 10) {
    let url = `/media?limit=${size}`;
    return new Promise((resolve, reject) => {
      clientApiFile
        .get(url)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  getSignedUrlMedia(id) {
    let url = "/media/signedUrl/:id".replace(":id", id);
    return new Promise((resolve, reject) => {
      clientApiFile
        .get(url)
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  ocrInpain({ mediaId = null, fileset = null }) {
    let url = "/ai/detect-ocr";
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, { provider: "google", mediaId, fileset })
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  translateSelected({
    type = null,
    source = null,
    target = null,
    texts = null,
    modelType = null,
    model = null,
  }) {
    let url = "/ai/translation";
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, { type, source, target, texts, modelType, model })
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
  removeBG({ media = null, fileset = null }) {
    let url = "/ai/remove-bg";
    return new Promise((resolve, reject) => {
      clientApi
        .post(url, { media, fileset })
        .then((res) => resolve(res.data))
        .catch((error) => reject(error));
    });
  },
};
