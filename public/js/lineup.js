const newFormHandler = async (event) => {
    event.preventDefault();
  
   
    const playerEls = document.getElementsByClassName('.player');
    var players = [];

    for(let i = 0; i < playerEls.length; i++)
{
    players = players.push(playerEls[i].value.trim());
}
  
    if (players.length > 0) {
      const response = await fetch(`/api/lineup`, {
        method: 'POST',
        body: JSON.stringify({ players }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
         //document.location.replace('/profile')
      } else {
        alert('Failed to create lineup');
      }
    }
  };
  
    
  document
    .querySelector('#lineupForm')
    .addEventListener('submit', newFormHandler);
  
  