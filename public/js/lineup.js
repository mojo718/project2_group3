const newFormHandler = async (event) => {
    event.preventDefault();
  
   
    const players = document.getElementsByClassName('.player');

    for(let i = 0; i < players.length; i++)
{
   
}
  
    if () {
      const response = await fetch(`/api/projects`, {
        method: 'POST',
        body: JSON.stringify({  }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/profile');
      } else {
        alert('Failed to create project');
      }
    }
  };
  
    
  document
    .querySelector('#lineupForm')
    .addEventListener('submit', newFormHandler);
  
  