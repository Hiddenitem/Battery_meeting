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
        const response = await fetch('../post_list.json');

        // 만약 응답이 ok가 아니라면? 오류 발생.
        if (!response.ok) {
            throw new Error(`HTTP error! Status : ${response.status}`);
        }

        // json 파일을 json 형태로 변환해주는 작업.
        const posts = await response.json();
        
        // 문제없이 파일이 로드되면, renderPosts 함수 실행
        renderPosts(posts);
    }
    // error 받기.
    catch (error) {
        // fetch나 json 변환 중 에러가 발생하면 콘솔에 출력
        console.error('포스트를 불러오는 중 오류가 발생했습니다:', error);

        // 직접적으로 오류 발생 코드 등장시키기.
        const post_list = document.getElementById('post-list');
        if (post_list) {
            post_list.innerHTML = '<li>글 목록을 불러오는 데 실패했습니다.</li>';
        }
    }
}

// 글들을 출력해주는 renderPosts() 함수 선언
function renderPosts(posts) {
    // 글들이 들어갈 HTML 태그 가져오기.
    const post_HTML_tag = document.getElementById('post-list');

    // 내부에 들어갈 HTML 코드가 작성될 변수 선언
    let post_HTML_data = "";

    // 길이를 가져와서 for 반복문을 돌림.
    posts_list_size = posts.length;
    for(var i = 0; i < posts_list_size; i++) {
        const post_HTML = `
            <li class="post-item">
                <h2>
                    <a href="${posts[i]['post_file_name']}">${posts[i]['post_title']}</a>
                </h2>
                <p class="post-meta">작성일: ${posts[i]['post_year']}년 ${posts[i]['post_month']}월 ${posts[i]['post_day']}일</p>
                <p class="post-excerpt">
                    ${posts[i]['post_summary']}
                </p>
            </li>
        `
        post_HTML_data += post_HTML;
    };
    // 마지막으로 추가된 모든 데이터들을 innerHTML을 통해 태그 속 HTML 코드로 변환해준다.
    post_HTML_tag.innerHTML = post_HTML_data;
};



