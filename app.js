// Music Class
class Music {
    constructor(title, singer, ismn, musicPath) {
        this.title = title;
        this.singer = singer;
        this.ismn = ismn;
        this.musicPath = musicPath;
    }
}

// UI Class -> responsible for showing Users information
class UI {
    static displayMusics() {
        /* Hard Coded Musics */
        // const StoredMusics = [
        //     {
        //         title: 'Likey',
        //         singer: 'Twice',
        //         ismn: '77281',
        //         musicPath: 'audio/TWICE-LIKEY.mp3'
        //     },
        //     {
        //         title: 'Signal',
        //         singer: 'Twice',
        //         ismn: '11232',
        //         musicPath: 'audio/TWICE-SIGNAL.mp3'
        //     }
        // ];

        const musics = Store.getMusics();
        musics.forEach((music) => UI.addMusicToList(music));
    }

    static addMusicToList(music) {
        const list = document.querySelector('#music-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${music.title}</td>
            <td>${music.singer}</td>
            <td>${music.ismn}</td>
            <audio controls class="mt-2" style="width: 200px;"><source src="audio/${music.musicPath}" type="audio/mp3"></audio>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteMusic(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#music-form');

        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#singer').value = '';
        document.querySelector('#ismn').value = '';
        document.querySelector('#music-file').value = '';
    }
}

// Store Class -> storing musics file that uploaded by users
class Store {
    static getMusics() {
        let musics;
        if (localStorage.getItem('musics') === null) {
            musics = [];
        } else {
            musics = JSON.parse(localStorage.getItem('musics'));
        }

        return musics;
    }

    static addMusic(music) {
        const musics = Store.getMusics();
        musics.push(music);
        localStorage.setItem('musics', JSON.stringify(musics));
    }

    static removeMusic(ismn) {
        const musics = Store.getMusics();
        musics.forEach((music, index) => {
            if(music.ismn === ismn) {
                musics.splice(index, 1);
            }
        });

        localStorage.setItem('musics', JSON.stringify(musics));
    }
}

// Event -> Display Musics
document.addEventListener('DOMContentLoaded', UI.displayMusics);

// Event -> Add Music
document.querySelector('#music-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.querySelector('#title').value;
    const singer = document.querySelector('#singer').value;
    const ismn = document.querySelector('#ismn').value;
    const musicPath = document.querySelector('#music-file').files[0];

    if (title === '' || singer === '' || ismn === '' || musicPath.name === '') {
        UI.showAlert('Please fill in all the fields', 'danger');
    } else {
        const music = new Music(title, singer, ismn, musicPath.name);
    
        UI.addMusicToList(music);
    
        Store.addMusic(music);

        UI.showAlert('Music Added', 'success');
    
        UI.clearFields();    
    }
});

// Event -> Remove Music
document.querySelector('#music-list').addEventListener('click', (e) => {
    UI.deleteMusic(e.target);

    Store.removeMusic(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

    UI.showAlert('Music Removed', 'success');
});