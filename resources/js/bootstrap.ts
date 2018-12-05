
import axios from 'axios';
import * as _ from 'lodash';
import jQuery from 'jquery';
import * as Popper from 'popper.js';
import 'bootstrap';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


let token : HTMLMetaElement | null = document.head!.querySelector('meta[name="csrf-token"]');

if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}
