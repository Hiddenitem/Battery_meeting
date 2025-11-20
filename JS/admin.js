// 전역 변수로 현재 포스트 배열을 저장
let currentPosts = [];

// 1. 페이지가 로드되면 즉시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 1-1. 필요한 HTML 요소들을 미리 찾아둠
    const postNumberInput = document.getElementById('post-number');
    const postTitleInput = document.getElementById('post-title');
    const postDateInput = document.getElementById('post-date');
    const postSummaryInput = document.getElementById('post-summary');
    const generateButton = document.getElementById('generate-button');
    const outputJsonTextarea = document.getElementById('output-json');

    // 1-2. 기존 posts.json 파일을 불러와서 화면에 세팅
    loadInitialData();

    // 1-3. "생성하기" 버튼에 클릭 이벤트 연결
    generateButton.addEventListener('click', generateNewJson);
});

/**
 * (비동기) 기존 posts.json을 fetch로 불러와서
 * 폼과 텍스트 영역을 초기화하는 함수
 */
async function loadInitialData() {
    try {
        // 'posts.json'이 루트 폴더에 있다고 가정
        const response = await fetch('../post_list.json');
        if (!response.ok) {
            throw new Error('posts.json 파일을 불러오는 데 실패했습니다.');
        }
        currentPosts = await response.json();
        
        // 1. 현재 JSON 내용을 텍스트 영역에 예쁘게(JSON.stringify) 표시
        const outputJsonTextarea = document.getElementById('output-json');
        outputJsonTextarea.value = JSON.stringify(currentPosts, null, 4); // null, 4는 예쁘게 들여쓰기
        
        // 2. (핵심) 마지막 포스트 번호를 찾아서, 다음 번호를 자동으로 입력
        if (currentPosts.length > 0) {
            const lastPost = currentPosts[currentPosts.length - 1];
            // 정규식을 사용해 '/POSTS/post2.html'에서 숫자 '2'만 추출
            const lastNumMatch = lastPost.post_file_name.match(/post(\d+)/);
            
            if (lastNumMatch && lastNumMatch[1]) {
                const nextNum = parseInt(lastNumMatch[1]) + 1;
                document.getElementById('post-number').value = nextNum;
            }
        } else {
            // 포스트가 하나도 없으면 1부터 시작
            document.getElementById('post-number').value = 1;
        }

        // 3. 오늘 날짜를 'YYYY-MM-DD' 형식으로 자동 입력
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('post-date').value = today;

    } catch (error) {
        console.error(error);
        document.getElementById('output-json').value = `오류 발생: ${error.message}\nLive Server로 실행 중인지 확인하세요.`;
    }
}

/**
 * "생성하기" 버튼을 눌렀을 때 실행되는 함수
 */
function generateNewJson() {
    // 1. 폼에서 현재 입력된 값들을 가져옴
    const num = document.getElementById('post-number').value;
    const title = document.getElementById('post-title').value;
    const dateString = document.getElementById('post-date').value; // "YYYY-MM-DD"
    const summary = document.getElementById('post-summary').value;

    // 2. 입력값 유효성 검사
    if (!num || !title || !dateString || !summary) {
        alert("모든 필드를 채워주세요!");
        return;
    }

    // 3. 날짜 데이터를 YYYY, M, D로 분해
    const dateObj = new Date(dateString); // 'YYYY-MM-DD'를 Date 객체로 변환
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // JavaScript의 월은 0부터 시작하므로 +1
    const day = dateObj.getDate();

    // 4. JSON 파일 구조에 맞게 새 포스트 객체 생성
    const newPost = {
        post_file_name: `./POSTS/post${num}/post${num}.html`,
        post_title: title,
        post_year: year,
        post_month: month,
        post_day: day,
        post_summary: summary
    };
    console.log(currentPosts);
    // 5. (안전장치) 이미 존재하는 포스트 번호인지 확인
    const alreadyExists = currentPosts.some(
        post => post.post_file_name === newPost.post_file_name
    );
    if (alreadyExists) {
        if (!confirm('이미 존재하는 포스트 번호입니다. 덮어쓰시겠습니까?\n(아니요 선택 시, 기존 데이터를 유지합니다)')) {
            // '아니요'를 선택하면, 기존 데이터를 유지한 채로 생성
            // (이 부분은 사용자가 원본을 복사해서 수정할 수 있도록 기존 배열을 보여주는 게 나을 수 있습니다)
            // 여기서는 일단, 이미 존재하면 추가하지 않도록 로직을 수정하는 것보다,
            // 사용자에게 경고하고, 사용자가 실수한 것을 인지하도록 하는게 낫습니다.
            // 여기서는 그냥 새 배열을 만들어서 덮어쓰기 합니다.
            alert('이미 존재하는 번호입니다. 포스트 번호를 수정해주세요.');
            return;
        }
        // (만약 덮어쓰기 로직을 원한다면, findIndex로 찾아서 교체해야 함)
        // 지금은 "추가"가 목적이므로, 중복 시 중단시킵니다.
    }


    // 6. 기존에 불러온 `currentPosts` 배열에 새 포스트 객체를 "추가"
    const updatedPosts = [...currentPosts, newPost]; // ...는 배열을 복사하는 문법

    // 7. 새로 합쳐진 배열을 다시 예쁜 JSON 문자열로 변환
    const outputString = JSON.stringify(updatedPosts, null, 4);

    // 8. 결과를 텍스트 영역에 덮어쓰기
    const outputJsonTextarea = document.getElementById('output-json');
    outputJsonTextarea.value = outputString;

    alert('JSON 생성이 완료되었습니다!\n텍스트 상자의 전체 내용을 복사하여 posts.json 파일에 덮어쓰세요.');
}