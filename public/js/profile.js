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
      alert("New Player Created");
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
      body: JSON.stringify({ name }),
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
  const battingAvg = document.querySelector('#updateAvg').value.trim();
  const homeRuns = document.querySelector('#updateHr').value.trim();
  const rbis = document.querySelector('#updateRbis').value.trim();
  
  
  if (name && position && hits && battingAvg && homeRuns && rbis) {
    const response = await fetch(`/api/players`, {
      method: 'PUT',
      body: JSON.stringify({ name, position, hits, battingAvg, homeRuns, rbis }),
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
  else {
    alert('All fields must be populated to update player!');
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