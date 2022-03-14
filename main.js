// 유저가 input 값을 입력한다.
// 유저가 + 버튼을 누르면 할일이 추가된다.
// 유저가 delete 버튼을 누르면 할일이 삭제된다.
// 유저가 check 버튼을 누르면 할일이 끝나면서 글자 위에 밑줄이 그어진다.
// 1. check 버튼 누르는 순간 false -> true
// 2. true: 완수로 간주하고 밑줄 보여주기
// 3. false: 미완수로 간수하고 그대로
// 진행중 끝남 탭을 누리면, 언더바가 이동한다.
// 끝남탭은 끝난 아이템만, 진행중탭은 진행중인 아이템만 나온다. 
// 전체탭을 누르면 다시 전체 아이템으로 돌아온다.

let taskInput =  document.getElementById("task-input");
let addButton = document.getElementById("add-button");
/* querySelectorAll : 조건에 맞는 모든 html 값을 가져옴 */
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("under-line");
/* 할 일의 배열 */
let taskList = [];
let filterList = [];
let mode = "all";

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(e){
    /* isComposing : 입력된 문자가 조합 문자인지 아닌지를 나타내는 논리 값 */
    if(e.key == "Enter" && !e.isComposing){
        addTask();
    }
});

for(let i=1; i<tabs.length; i++){
    tabs[i].addEventListener("click",function(e){
        filter(e)
    });
}

function addTask() {
    let taskContent = taskInput.value;
    /* 객체: 관련 있는 정보를 하나로 묶기 위해. 추가 정보를 같이 넣기 위해 사용 */
    let task = {
        taskContent,
        isComplete: false,
        id:randomIDGenerator(),
    };
    taskList.push(task);
    taskInput.value = "";
    render();
}

function render(){
    let resultHtml = "";
    List = [];
    if(mode == "all"){
        List = taskList;
    }else{
        List = filterList;
    }

    /* 
    33: taskList 배열 안에 있는 아이템을 가지고 올림
    38: taskList에 있는 i값 중, taskContent만 출력
    41: onclick: button에 효과를 바로 주는 방법
    */
    for(let i=0; i<List.length; i++){
        /* 값이 끝났을 때,  */
        if(List[i].isComplete){
                resultHtml += `<div class="task">
            <div class="task-done">${List[i].taskContent}</div>
            <div class="button-box">
            <button onclick="toggleComplete('${List[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
            <button onclick="removeTask('${List[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            </div>`;
        }else{
            resultHtml += `<div class="task">
            <div>${List[i].taskContent}</div>
            <div class="button-box">
            <button onclick="toggleComplete('${List[i].id}')"><i class="fa-solid fa-check"></i></button>
            <button onclick="removeTask('${List[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            </div>`;
        }
    }

    /* html에서 task자리를 가져오고, 그 안의 값을 resultHtml로 채움 */
    document.getElementById("task-board").innerHTML = resultHtml;
}

 /* 여러개의 check버튼 중에서 어떤 아이템의 check버튼을 눌렀는지 id를 부여해서 알려주어야함 */
 function toggleComplete(id){
    /* id 갖고 있는 애 누구냐 나와라 (겁나 찾음) */
    for(let i=0; i<taskList.length; i++){
        if(taskList[i].id == id){
            /* ! : 현재 가지고 있는 값의 반대 값을 불러옴 */
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    filter();
}

function removeTask(id){
    for(let i=0; i<taskList.length; i++){
        if(taskList[i].id == id){
            /* taskList에 있는 값 중 i번째 1개의 값만 삭제 */
            taskList.splice(i,1);
            break;
        }
    }
    filter();
}

function filter(e){
    if(e){
        mode = e.target.id;
        underLine.style.width = e.target.offsetWidth + "px";
        underLine.style.left = e.target.offsetLeft + "px";
        underLine.style.top =
        e.target.offsetTop + (e.target.offsetHeight - 4) + "px";
    }

    filterList = [];
    if(mode === "ongoing"){
        for(let i=0; i<taskList.length; i++){
            if (taskList[i].isComplete == false){
                filterList.push(taskList[i]);
            }
        }
    }else if(mode === "done"){
        for(let i=0; i<taskList.length; i++){
            if(taskList[i].isComplete){
                filterList.push(taskList[i]);
            }
        }
    }
    render();

    /* 
    event : 클릭했을 때 발생하는 모든 정보. 
    target : 그 중에서도 내가 원하는 대상의 정보.
    id : 원하는 대상의 id 정보.

    console.log("filter 클릭됨",event.target.id);
    */

}

function randomIDGenerator(){        
    return '_' + Math.random().toString(36).substr(2, 9);
}