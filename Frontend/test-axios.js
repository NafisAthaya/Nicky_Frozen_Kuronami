const axios = require('axios');
(async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/owner/cabang', {
      nama_cabang: 'Test JS',
      alamat: 'Test JS',
      manajer: '',
      jam_operasional: '08:00 - 21:00'
    }, {
      headers: {
        'Authorization': 'Bearer 3|48VlKqZITma8m208rsMCcy8rnW9LgGi90aVXVXiM943bc5f2',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log("Success:", response.data);
  } catch (err) {
    console.log("Error:", err.response ? err.response.data : err.message);
  }
})();
