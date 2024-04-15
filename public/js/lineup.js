const newLineup = async (event) => {
    event.preventDefault();
  
    const player1 = document.querySelector('#order1').value.trim();
    const player2 = document.querySelector('#order2').value.trim();
    const player3 = document.querySelector('#order3').value.trim();
    const player4 = document.querySelector('#order4').value.trim();
    const player5 = document.querySelector('#order5').value.trim();
    const player6 = document.querySelector('#order6').value.trim();
    const player7 = document.querySelector('#order7').value.trim();
    const player8 = document.querySelector('#order8').value.trim();
    const player9 = document.querySelector('#order9').value.trim();
    const game_date = document.querySelector("#gameDate").value.trim();
  
    if (game_date) {
      const response = await fetch(`/api/lineup`, {
        method: 'POST',
        body: JSON.stringify({ player1, player2, player3, player4,
          player5, player6, player7, player8, player9, game_date }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
         alert('Lineup Successfully Created!');
      } else {
        alert('Failed to create lineup');
      }
    }
  };
  
    
  document
    .querySelector('#lineupForm')
    .addEventListener('submit', newLineup);
  
  