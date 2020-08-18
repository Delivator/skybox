export const utils = {
  data: function () {
    return {
      skylinkRegex: /^[a-zA-Z0-9-_]{46}$/,
    };
  },

  methods: {
    getSkylinkFiles: function (skylink) {
      return new Promise((resolve, reject) => {
        if (!skylink) return reject();
        fetch(`/${skylink}`, { method: "HEAD" })
          .then((resp) => {
            if (resp.status !== 200) return reject(resp.status);
            if (!resp.headers.has("skynet-file-metadata"))
              return reject("No metadata preset in headers");
            const metadata = JSON.parse(
              resp.headers.get("skynet-file-metadata")
            );
            resolve(metadata);
          })
          .catch(reject);
      });
    },
    getFileContent: function (link) {
      return new Promise((resolve, reject) => {
        if (!link) return reject();
        fetch(`/${link}`)
          .then((resp) => {
            if (resp.status !== 200) return reject(resp.status);
            resp.text().then(resolve);
          })
          .catch(reject);
      });
    },
  },
};
