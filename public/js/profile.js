const newPlayer = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#addName').value.trim();
  const position = document.querySelector('#addPosition').value.trim();
  
  if (name && position) {
    const response = await fetch(`/api/players`, {
      method: 'POST',
      body: JSON.stringify({ name, position }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log("New Player Created");
    } else {
      alert('Failed to create player');
    }
  }
};

const delPlayer = async (event) => {
  event.preventDefault();
  const name = document.querySelector('#deleteName').value.trim();

    const response = await fetch(`/api/players`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Player Deleted');
    } else {
      alert('Failed to delete player');
    }
  };

const updatePlayer = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#updateName').value.trim();
  const position = document.querySelector('#updatePosition').value.trim();
  const hits = document.querySelector('#updateHits').value.trim();
  const avg = document.querySelector('#updateAvg').value.trim();
  const hr = document.querySelector('#updateHr').value.trim();
  const rbis = document.querySelector('#updateRbis').value.trim();
  
  
  
  
  if (name && position) {
    const response = await fetch(`/api/players`, {
      method: 'PUT',
      body: JSON.stringify({ name, position }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log("Player Updated");
    } else {
      alert('Failed to update player');
    }
  }
};

document
  .querySelector('.addPlayer')
  .addEventListener('submit', newPlayer);

document
  .querySelector('.deletePlayer')
  .addEventListener('click', delPlayer);

  document
  .querySelector('.updatePlayer')
  .addEventListener('click', updatePlayer);