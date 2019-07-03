// 申告變數_三大區塊
let content = document.querySelector('.content');
let wrap_initial = document.querySelector('.content .wrap_initial');
let contain = document.querySelector('.content .contain');

// 申告變數_導航列
let myTasks = document.querySelector('.header li:nth-child(1)');
let progress = document.querySelector('.header li:nth-child(2)');
let completed = document.querySelector('.header li:nth-child(3)');

// 物件初始化
const userdata_ob = JSON.parse(localStorage.getItem('todolist')) || [];


// 上方Add Task
// 展開，閉合
function initial_open(e) {
    if (e.path[2].classList.contains('wrap_initial')){
        e.path[2].classList.remove('wrap_initial');
        e.path[2].classList.add('wrap_editing');
    }
}

function initial_close(e){
    if (e.path[3].classList.contains('wrap_editing')){
        // reset 確認 取消鈕
        e.path[3].classList.remove('wrap_editing');
        e.path[3].classList.add('wrap_initial');
        clear();
    }else if(wrap_initial.classList.contains('wrap_editing')){
        // close 編輯鈕
        e.preventDefault();
        wrap_initial.classList.remove('wrap_editing');
        wrap_initial.classList.add('wrap_initial');
    }
}

// 星星，checkbox
function setStar(e){
    e.preventDefault();
    if(!e.path[2].classList.contains('important')){
        e.path[2].classList.add('important');
    }else{
        e.path[2].classList.remove('important');
    }
}

function done(e){
    if(!e.path[2].classList.contains('checked')){
        e.path[2].classList.add('checked');
    }else{
        e.path[2].classList.remove('checked');
    }
}

// 清除，送出鍵
function clear(e){
    document.querySelector('.content .wrap_initial .title input[type="text"]').value = '';
    document.querySelector('.content .wrap_initial .editZone .data input[type="date"]').value = '';
    document.querySelector('.content .wrap_initial .editZone .data input[type="time"]').value = '';
    document.querySelector('.content .wrap_initial .editZone .data input[type="file"]').value = '';
    document.querySelector('.content .wrap_initial .editZone .data #comment').value = '';
    document.querySelector('.content .wrap_initial').classList.remove('important');
    document.querySelector('.content .wrap_initial').classList.remove('checked');
    document.querySelector('.content .wrap_initial .title input[type="checkbox"]').checked = false;
}

function getdata(e){
    e.preventDefault();
    
    userdata_ob.push({
        title: document.querySelector('.content .wrap_editing .title input[type="text"]').value,
        date: document.querySelector('.content .wrap_editing .editZone .data input[type="date"]').value,
        time: document.querySelector('.content .wrap_editing .editZone .data input[type="time"]').value,
        file: document.querySelector('.content .wrap_editing .editZone .data input[type="file"]').value,
        comment: document.querySelector('.content .wrap_editing .editZone .data #comment').value,
        star: function(){if(e.path[3].classList.contains('important')){
            return 'important'
        }else{
            return ''
        }}(),
        check: function(){if(e.path[3].classList.contains('checked')){
            return 'checked'
        }else{
            return ''
        }}(),
        readonly: 'readonly',
        status: 'wrap_list_close'
    });
    setlocal();
    initial_close(e);
}

// 存進快取
function setlocal(e){
    localStorage.setItem('todolist',JSON.stringify(userdata_ob));
    listRefresh();
}

// 清單初始化
function listRefresh(e){
    wrap_initial.innerHTML = 
        `<div class="title">
                <input type="checkbox" id="check">
                <label for="check"></label>
                <input type="text" placeholder="Add Task">
                <a href="#" class="star"></a>
                <a href="#" class="edit"></a>
            </div>
            <div class="editZone">
                <form class="data">
                    <fieldset>
                        <label>Deadline</label>
                        <input type="date">
                        <input type="time">

                        <label>File</label>
                        <label for="file" class="update">+</label>
                        <input type="file" id="file">

                        <label for="comment">Comment</label>
                        <textarea id="comment" cols="30" rows="3" placeholder="Type your memo here..."></textarea>
                    </fieldset>

                    <button type="reset">Cancel</button>
                    <button type="submit">Add Task</button>
                </form>
            </div>`;

    contain.innerHTML = "";
    for (let i = 0; i < userdata_ob.length; i++) {
        contain.innerHTML +=
        `<div class="${userdata_ob[i].status} ${userdata_ob[i].star} ${userdata_ob[i].check}" data-num="${i}">
            <div class="title">
                <input type="checkbox" id="check_list_${i}" class="checkbox"  data-check="${i}" ${userdata_ob[i].check}>
                <label for="check_list_${i}"></label>
                <input type="text" placeholder="Add Task" value="${userdata_ob[i].title}" ${userdata_ob[i].readonly}>
                <a href="#" class="star" data-star="${i}"></a>
                <a href="#" class="edit" data-pen="${i}"></a>
                <a href="#" class="delete" data-delete="${i}"></a>
    
                <ul class="information">`
                    +
                    (function (){
                        if(userdata_ob[i].date !== ''){
                            return `<li class="date">${userdata_ob[i].date}</li>`;
                        }else{
                            return ``;
                        }
                    }())
                    +
                    (function file(){
                        if(userdata_ob[i].file !== ''){
                            return `<li class="file"></li>`;
                        }else{
                            return ``;
                        }
                    }())
                    +
                    (function comment(){
                        if(userdata_ob[i].comment !== ''){
                            return `<li class="comment"></li>`;
                        }else{
                            return ``;
                        }
                    }())
                    +
                `</ul>
            </div>
            <div class="editZone">
                <form class="data">
                    <fieldset>
                        <label>Deadline</label>
                        <input type="date" value="${userdata_ob[i].date}">
                        <input type="time" value="${userdata_ob[i].time}">
                
                        <label>File</label>
                        <label for="file_${i}" class="update">+</label>
                        <input type="file" id="file_${i}">

                        <label for="comment_${i}">Comment</label>
                        <textarea id="comment_${i}"cols="30" rows="3" placeholder="Type your memo here...">${userdata_ob[i].comment}</textarea>
                    </fieldset>
                
                    <button type="reset">Cancel</button>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>`
    }    
}

// nav篩選函式
function listFilter_pro(e){
    e.preventDefault();
    myTasks.classList.remove('now');
    completed.classList.remove('now');
    progress.classList.add('now');

    initial_close(e);
    contain.innerHTML = ``;
    wrap_initial.innerHTML = ``;
    for (let i = 0; i < userdata_ob.length; i++) {
        if(userdata_ob[i].check === ''){
            contain.innerHTML +=
            `<div class="${userdata_ob[i].status} ${userdata_ob[i].star} ${userdata_ob[i].check}" data-num="${i}">
                <div class="title">
                    <input type="checkbox" id="check_list_${i}" class="checkbox"  data-check="${i}" ${userdata_ob[i].check}>
                    <label for="check_list_${i}"></label>
                    <input type="text" placeholder="Add Task" value="${userdata_ob[i].title}" ${userdata_ob[i].readonly}>
                    <a href="#" class="star" data-star="${i}"></a>
                    <a href="#" class="edit" data-pen="${i}"></a>
                    <a href="#" class="delete" data-delete="${i}"></a>
    
                    <ul class="information">`
                        +
                        (function (){
                            if(userdata_ob[i].date !== ''){
                                return `<li class="date">${userdata_ob[i].date}</li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                        (function file(){
                            if(userdata_ob[i].file !== ''){
                                return `<li class="file"></li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                        (function comment(){
                            if(userdata_ob[i].comment !== ''){
                                return `<li class="comment"></li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                    `</ul>
                </div>
                <div class="editZone">
                    <form class="data">
                        <fieldset>
                            <label>Deadline</label>
                            <input type="date" value="${userdata_ob[i].date}">
                            <input type="time" value="${userdata_ob[i].time}">
                
                            <label>File</label>
                            <label for="file_${i}" class="update">+</label>
                            <input type="file" id="file_${i}">

                            <label for="comment_${i}">Comment</label>
                            <textarea id="comment_${i}"cols="30" rows="3" placeholder="Type your memo here...">${userdata_ob[i].comment}</textarea>
                        </fieldset>
                
                        <button type="reset">Cancel</button>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>`
        }  
    }
}

function listFilter_com(e){
    e.preventDefault();
    myTasks.classList.remove('now');
    completed.classList.add('now');
    progress.classList.remove('now');
    
    initial_close(e);
    contain.innerHTML = ``;
    wrap_initial.innerHTML = ``;
    for (let i = 0; i < userdata_ob.length; i++) {
        if(userdata_ob[i].check === 'checked'){
            contain.innerHTML +=
            `<div class="${userdata_ob[i].status} ${userdata_ob[i].star} ${userdata_ob[i].check}" data-num="${i}">
                <div class="title">
                    <input type="checkbox" id="check_list_${i}" class="checkbox"  data-check="${i}" ${userdata_ob[i].check}>
                    <label for="check_list_${i}"></label>
                    <input type="text" placeholder="Add Task" value="${userdata_ob[i].title}" ${userdata_ob[i].readonly}>
                    <a href="#" class="star" data-star="${i}"></a>
                    <a href="#" class="edit" data-pen="${i}"></a>
                    <a href="#" class="delete" data-delete="${i}"></a>
    
                    <ul class="information">`
                        +
                        (function (){
                            if(userdata_ob[i].date !== ''){
                                return `<li class="date">${userdata_ob[i].date}</li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                        (function file(){
                            if(userdata_ob[i].file !== ''){
                                return `<li class="file"></li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                        (function comment(){
                            if(userdata_ob[i].comment !== ''){
                                return `<li class="comment"></li>`;
                            }else{
                                return ``;
                            }
                        }())
                        +
                    `</ul>
                </div>
                <div class="editZone">
                    <form class="data">
                        <fieldset>
                            <label>Deadline</label>
                            <input type="date" value="${userdata_ob[i].date}">
                            <input type="time" value="${userdata_ob[i].time}">
                
                            <label>File</label>
                            <label for="file_${i}" class="update">+</label>
                            <input type="file" id="file_${i}">

                            <label for="comment_${i}">Comment</label>
                            <textarea id="comment_${i}"cols="30" rows="3" placeholder="Type your memo here...">${userdata_ob[i].comment}</textarea>
                        </fieldset>
                
                        <button type="reset">Cancel</button>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>`
        }  
    }
}

// 確認點擊區域
function initial_check(e){
    switch (e.target.type) {
        case 'text':
            initial_open(e);
            break;
        case 'reset':
            initial_close(e);
            break;
        case 'submit':
            getdata(e);
            break;
        case 'checkbox':
            done(e);
            break;
    }

    if (e.target.className === 'edit'){
        initial_close(e);
    }else if(e.target.className === 'star'){
        setStar(e);
    }
}

// Add Task_nav監聽
progress.addEventListener('click',listFilter_pro,false);
completed.addEventListener('click',listFilter_com,false);
myTasks.addEventListener('click',function(e){
    e.preventDefault();
    myTasks.classList.add('now');
    completed.classList.remove('now');
    progress.classList.remove('now');
    listRefresh();
},false);

// Add Task_區塊監聽
wrap_initial.addEventListener('click',initial_check,false);



// 下方清單
// 星星，筆，刪除，checkbox
function changeStar(e){
    if(!e.path[2].classList.contains('important')){
        userdata_ob[e.target.dataset.star].star = 'important';
    }else{
        userdata_ob[e.target.dataset.star].star = '';
    }
    setlocal();
}

function pen_changeRead(e){
    if(e.path[2].classList.contains('wrap_list_close')){
        userdata_ob[e.target.dataset.pen].status = 'wrap_list_open';
        userdata_ob[e.target.dataset.pen].readonly = '';
    }else{
        userdata_ob[e.target.dataset.pen].status = 'wrap_list_close';
        userdata_ob[e.target.dataset.pen].readonly = 'readonly';
    }
    setlocal();
}

function deleteList(e){
    if(e.path[2].classList.contains('wrap_list_close') || e.path[2].classList.contains('wrap_list_open')){
        if (confirm("確定刪除此項目？")){
            userdata_ob.splice(e.target.dataset.delete,1);
            setlocal();
        }
    }
}

function changeCheck(e) {
    if(!e.path[2].classList.contains('checked')){
        userdata_ob[e.target.dataset.check].check = 'checked';
    }else{
        userdata_ob[e.target.dataset.check].check = '';
    }
    setlocal();
}


// 下方清單_確認點擊區域
function checkClick(e){
    if(e.target.localName === 'a'){
        e.preventDefault();
    }
    
    if(e.target.className === 'star'){
        changeStar(e);
    }else if(e.target.className === 'edit'){
        pen_changeRead(e);
    }else if(e.target.className === 'delete'){
        deleteList(e);
    }else if(e.target.className === 'checkbox'){
        changeCheck(e);
    }else if(e.target.type === 'submit'){
        e.preventDefault();
        let title = document.querySelectorAll('.contain .title input[type="text"]');
        let date = document.querySelectorAll('.contain .editZone input[type="date"]');
        let time = document.querySelectorAll('.contain .editZone input[type="time"]');
        let file = document.querySelectorAll('.contain .editZone input[type="file"]');
        let comment = document.querySelectorAll('.contain .editZone textarea');
        for (let i = 0; i < title.length; i++) {
            userdata_ob[i].title = title[i].value;
            userdata_ob[i].date = date[i].value;
            userdata_ob[i].time = time[i].value;
            userdata_ob[i].file = file[i].value;
            userdata_ob[i].comment = comment[i].value;
            
        }
        userdata_ob[e.path[3].dataset.num].status = 'wrap_list_close';
        userdata_ob[e.path[3].dataset.num].readonly = 'readonly';
        setlocal();
    }else if(e.target.type === 'reset'){
        e.preventDefault();
        userdata_ob[e.path[3].dataset.num].status = 'wrap_list_close';
        userdata_ob[e.path[3].dataset.num].readonly = 'readonly';
        setlocal();
    }
}
// 下方清單_區塊監聽
contain.addEventListener('click',checkClick,false);

// 清單初始化
listRefresh();