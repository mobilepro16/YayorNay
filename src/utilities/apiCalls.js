import axios from 'axios';

const host = 'http://api.yayornaystylist.com:3000';

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/login', {
        email: email,
        password: password
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  loginWithTOken: (userId, token) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/loginWithToken', {
        userId,
        token
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  requestForgetPass: (email) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/forgotPassword', {
        email: email
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  registration: (name, email, password) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/register', {
        email: email,
        password: password,
        name: name
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  activation: (email, activationCode) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/checkActivationCode', {
        email: email,
        activationCode: activationCode,
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  changePassword: (oldPassword, NewPassword) => {
    return new Promise((resolve, reject) => {
      axios.post(host + '/changePassword', {
        oldPassword: oldPassword,
        newPassword: NewPassword
      })
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  updateProfile: (profile) => {
    return new Promise((resolve, reject) => {
      axios.put(host + '/profile', profile)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    });
  }
  ,
  selfProfile: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/profile')
          .then((response) => {

            console.log(response);
            return resolve(response.data);
          })
          .catch((err) => {
                          console.log(err.response)
            return reject(err.response.data);
          })
    })
  },
  sendMessage: (styleId, content, type = 'text') => {
    const body = {
      content: content,
      isText: type === 'text',
      isImage: type === 'image',
      isVideo: type === 'video'
    };
    return new Promise((resolve, reject) => {
      axios.post(host + '/messages/' + styleId, body)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  sendMessageImage: (styleId, image) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('isImage', '1');
      formData.append('isText', null);
      formData.append('isVideo', null);
      formData.append('image', {
        name: makeid(8)+'.jpg',
        uri: '' + image.uri,
        type: 'image/jpg'
      });
      axios({
        method: 'POST',
        data: formData,
        baseURL: host,
        url: '/messages/'+ styleId,
      }).then((response) => {
        return resolve(response.data);
      })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullMessages: (styleId) => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/messages/' + styleId)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullMessagesSince: (styleId, sinceTimestamp) => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/messages/' + styleId + '/' + sinceTimestamp)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullMessagesSinceId: (styleId, lastMessageId) => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/messages/' + styleId + '/sinceId/' + lastMessageId)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  listStyles: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/styles')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  listClosetItems: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/closet')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  newStyle: (image, tagsId = [], name = '') => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('tags', JSON.stringify(tagsId));
      formData.append('name', name);
      formData.append('image', {
        name: makeid(8)+'.jpg',
        uri: '' + image.uri,
        type: 'image/jpg'
      });
      axios({
        method: 'POST',
        data: formData,
        baseURL: host,
        url: '/styles',
      }).then((response) => {
        console.log(response);
        return resolve(response.data);
      })
          .catch((err) => {
            console.log(err);
            return reject(err.response.data)
          })
    })
  },
  pullStyleDetail: (styleId) =>{
    return new Promise((resolve, reject) => {
      axios.get(host + '/styles/'+ styleId)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  resendActivationCode: (email) =>{
    return new Promise((resolve, reject) => {
      axios.post(host + '/resendActivationCode', {email})
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  newClosetItem: (image, tagsId = [], data = {}) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('tags', JSON.stringify(tagsId));
      if(image && image.uri){
        formData.append('image', {
          name: makeid(8)+'.jpg',
          uri: '' + image.uri,
          type: 'image/jpg'
        });
      }
      for (let [key, value] of Object.entries(data)){
        formData.append(key, value.toString());
      }
      axios({
        method: 'POST',
        data: formData,
        baseURL: host,
        url: '/closet',
      }).then((response) => {
        return resolve(response.data);
      }).catch((err) => {
        return reject(err.response.data)
      })
    })
  },
  pullALLClosetItems: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/closet')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullSingleClosetItem: (itemId) => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/closet/' + itemId)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullStyleTags: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/tags/style')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  pullClosetTags: () => {
    return new Promise((resolve, reject) => {
      axios.get(host + '/tags/closet')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  setFCMToken(token){
    return new Promise((resolve, reject) => {
      axios.post(host + '/setFCMToken', {fcmToken: token})
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
    deleteClosetItem(itemId){
        return new Promise((resolve, reject) => {
            axios.delete(host + `/closet/${itemId}`)
                .then((response) => {
                    return resolve(response.data);
                })
                .catch((err) => {
                    return reject(err.response.data)
                })
        })
    },
  getMyClientsChat(){
    return new Promise((resolve, reject) => {
      axios.get(host + '/styles/myClientsChat')
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  getMyClientProfile(clientId){
    return new Promise((resolve, reject) => {
      axios.get(host + '/profile/myClient/'+clientId)
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  },
  setUserAvatar(image){
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', {
        name: makeid(8)+'.jpg',
        uri: '' + image.uri,
        type: 'image/jpg'
      });
      axios({
        method: 'POST',
        data: formData,
        baseURL: host,
        url: '/setUserAvatar',
      }).then((response) => {
        return resolve(response.data);
      }).catch((err) => {
        return reject(err.response.data)
      })
    })
  },
  setUserStatus(isOnline){
    return new Promise((resolve, reject) => {
      axios.post(host + '/setUserStatus', {isOnline: isOnline})
          .then((response) => {
            return resolve(response.data);
          })
          .catch((err) => {
            return reject(err.response.data)
          })
    })
  }
};
