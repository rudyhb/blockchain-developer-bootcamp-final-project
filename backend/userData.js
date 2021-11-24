const data = {};

const getStatusForNftId = async id => {
  return data[id] || "";
}

const setStatusForNftId = async (id, status) => {
  if (status.length > 300)
    throw new Error('status is too long');
  data[id] = status;
}

module.exports = {
  getStatusForNftId,
  setStatusForNftId
};
