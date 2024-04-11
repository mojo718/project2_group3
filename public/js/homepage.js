const createLineup = async (event) => {
    event.preventDefault();

    document.location.replace('/lineup');

    return;
}

document.querySelector('#createLineup')
.addEventListener('click', createLineup);