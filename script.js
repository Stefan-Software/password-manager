/**
 * An object containing user input fields.
 * @type {userInputInterface}
 */
const userInput = {
    username: {
        element: document.getElementById('Username'),
        value: ''
    },
    server: {
        element: document.getElementById('Server'),
        value: ''
    },
    password: {
        element: document.getElementById('Password'),
        value: ''
    }
};
const urlSafeRegex = /^[a-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
for (const key in userInput) {
    userInput[key].element.addEventListener('input', () => {
        if (userInput[key].element.id === 'Username') {
            userInput.username.value = userInput.username.element.value;
        }
        else if (userInput[key].element.id === 'Server') {
            if (urlSafeRegex.test(userInput.server.element.value)) {
                userInput.server.value = userInput.server.element.value;
            }
            else {
                userInput.server.element.value = userInput.server.element.value.slice(0, -1);
                userInput.server.value = userInput.server.element.value;
            }
        }
        else if (userInput[key].element.id === 'Password') {
            userInput.password.value = userInput.password.element.value;
        }
        else {
            console.log('Error');
        }
    });
}
document.getElementById('submit-button').addEventListener('click', () => {
    /**
     * Organised Data
     * @param {string} username - Username value
     * @param {string} server - Server value
     * @param {string} password - Password value
     */
    const data = {
        username: userInput.username.value,
        server: userInput.server.value,
        password: userInput.password.value
    };
    /**
     * Global Storage for data to be parsed
     */
    const storage = [
        data.username,
        data.server,
        data.password
    ];
    // Retrieve Data
    const globalStorage = JSON.parse(localStorage.getItem('storage'));
    // Add to storage the data
    globalStorage.push(storage);
    localStorage.setItem('storage', JSON.stringify(globalStorage));
});
document.getElementById('manage-passwords').addEventListener('click', () => {
    // Create bootstrap modal popup
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'modalLabel');
    modal.setAttribute('aria-hidden', 'true');
    // Add modal content
    const globalStorage = JSON.parse(localStorage.getItem('storage'));
    let modalContent = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Manage Passwords</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Username</th>
                                <th scope="col">Server</th>
                                <th scope="col">Password</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    globalStorage.forEach((storageUnit, index) => {
        modalContent += `
            <tr>
                <th scope="row">${index + 1}</th>
                <td>${storageUnit[0]}</td>
                <td>${storageUnit[1]}</td>
                <td>${storageUnit[2]}</td>
                <td><button type="button" class="btn btn-danger btn-sm" data-index="${index}">Delete</button></td>
            </tr>
        `;
    });
    modalContent += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    modal.innerHTML = modalContent;
    // Add modal to the DOM
    document.body.appendChild(modal);
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    // Add event listener to delete buttons
    const deleteButtons = modal.querySelectorAll('.btn-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            globalStorage.splice(index, 1);
            localStorage.setItem('storage', JSON.stringify(globalStorage));
            modalContent = modalContent.replace(`data-index="${index}"`, '');
            modal.innerHTML = modalContent;
        });
    });
    // Remove modal from DOM after it's closed
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
});
document.getElementById('reset-passwords').addEventListener('click', () => {
    // Give a bootstrap warning to the user
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = 'modal';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', 'modalLabel');
    modal.setAttribute('aria-hidden', 'true');
    // prompt the user if they want to reset all passwords
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    Are you sure you want to reset all passwords?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" id="reset-passwords-confirm">Confirm</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    document.getElementById('reset-passwords-confirm').addEventListener('click', () => {
        localStorage.setItem('storage', JSON.stringify([]));
        modalInstance.hide();
    });
    // Remove modal from DOM after it's closed
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
});
/**
 * Indicates to the app if the website is in fullscreen mode or not.
 */
let isFullscreen = false;
document.getElementById('fullscreen').addEventListener('click', () => {
    const body = document.body;
    if (!isFullscreen) {
        body.requestFullscreen();
        isFullscreen = true;
    }
    else {
        document.exitFullscreen();
        isFullscreen = false;
    }
});
