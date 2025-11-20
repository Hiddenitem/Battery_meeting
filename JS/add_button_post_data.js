// DOMContentLoaded를 작성하여, DOM 콘텐츠가 모두 로드된 이후, 함수를 실행하도록 함.
document.addEventListener('DOMContentLoaded', () => {
    // loadPosts 함수 실행
    loadPosts();
})

// 비동기 함수 loadPosts 선언
async function loadPosts() {
    try {
        // fetch를 통해 post_list.json 파일을 가져옴.
        // await는 해당 작업이 끝날 때가지 기다리라는 코드.
        const response = await fetch('../../post_list.json');

        // 만약 응답이 ok가 아니라면? 오류 발생.
        if (!response.ok) {
            throw new Error(`HTTP error! Status : ${response.status}`);
        }

        // json 파일을 json 형태로 변환해주는 작업.
        const posts = await response.json();
        
        // 문제없이 파일이 로드되면, renderPosts 함수 실행
        specify_posts(posts);
    }
    // error 받기.
    catch (error) {
        // fetch나 json 변환 중 에러가 발생하면 콘솔에 출력
        console.error('포스트를 불러오는 중 오류가 발생했습니다:', error);

        // 직접적으로 오류 발생 코드 등장시키기.
        const post_list = document.getElementById('button_container');
        if (post_list) {
            var ERROR_data_box = document.createElement('div');
            ERROR_data_box.innerHTML = "포스트 목록을 불러오는데 실패했습니다.";
        }
    }
}

function specify_posts(posts) {
    // 1. window.location.pathname을 사용한 방법
    // 현재 페이지의 파일명을 추출합니다.
    var path = window.location.pathname;
    console.log(path);

    // 2. 현재 글의 인덱스를 가져옴.
    const current_post_index = posts.findIndex(post => post.post_file_name === `.${path}`);

    // 3. 이전글, 다음글 html 코드 가져오기
    var next_post_button_tag = document.getElementById("next_post_button");
    var previous_button_tag = document.getElementById("previous_post_button");

    // 만약, 현재 글의 인덱스를 찾을 수 없다면?
    if (current_post_index === -1) {
        console.warn(`'${path}'을 찾을 수 없습니다.`)
        if (next_post_button_tag) next_post_button_tag.style.display = 'none';
        if (previous_button_tag) previous_button_tag.style.display = 'none';
        return;
    }

    // 만약, 현재 글의 인덱스가 0보다 크다면? == 이전글이 있다.
    if (current_post_index > 0) {
        const prevPost = posts[current_post_index - 1];
        previous_button_tag.href = `/${prevPost['post_file_name']}`;
    }
    // 0보다 작다면? == 이전글이 없으니, 버튼 안보이게 하기.
    else {
        previous_button_tag.style.display = 'none';
    }

    // 다음글에 대한 것도 마찬가지로 진행.
    if (current_post_index < posts.length - 1) {
        const nextPost = posts[current_post_index + 1];
        next_post_button_tag.href = `/${nextPost['post_file_name']}`;
    }
    else {
        next_post_button_tag.style.display = 'none';
    }
}

