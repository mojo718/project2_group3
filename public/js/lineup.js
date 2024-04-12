const newLineup = async (event) => {
    event.preventDefault();
  
   
    const playerEls = document.getElementsByClassName('.player');
    var players = [];
    const game_date = document.querySelector("#gameDate").value.trim();

    for(let i = 0; i < playerEls.length; i++)
{
    players = players.push(playerEls[i].value.trim());
}
  
    if (players.length > 0) {
      const response = await fetch(`/api/lineup`, {
        method: 'POST',
        body: JSON.stringify({ players, game_date }),
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
  
  