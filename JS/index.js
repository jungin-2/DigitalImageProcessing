// 전역 변수부
// 진짜 원본, 불러온 이미지, 바꾼 이미지
var inCanvas, inCtx, inPaper, inFile;
var inImage, inH, inW;  // 중요!

var outCanvas, outCtx, outPaper;
var outImage, outH, outW;  // 중요!

// 함수 선언부
function init() {
    inCanvas = document.getElementById("inCanvas"); // 도화지에 접근
    inCtx = inCanvas.getContext('2d'); // 물감, 붓이 들은 통
    outCanvas = document.getElementById("outCanvas"); // 도화지에 접근
    outCtx = outCanvas.getContext('2d'); // 물감, 붓이 들은 통
}
function openImage() {
    inFile = document.getElementById("inFile").files[0]; // Lena512.raw
    // (중요!) 이미지의 폭과 높이를 계산
    inH = inW = Math.floor( Math.sqrt(inFile.size));
    saveH=inH;
    saveW=inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    inImage = new Array(inH);
    for (var i=0; i<inH; i++)
        inImage[i] = new Array(inW);

    saveImage = new Array(saveH);
    for (var i=0; i<saveH; i++)
        saveImage[i] = new Array(saveW);        
    // 캔버스 크기 지정
    inCanvas.height = inH;
    inCanvas.width = inW;  

    // 파일 --> 메모리로 로딩
    var reader = new FileReader();
    reader.readAsBinaryString(inFile);
    reader.onload = function() {
        var blob = reader.result; // 파일을 한 덩어리(blob)로 가져옴
        // blob에서 한점씩 뽑아서 --> inImage 메모리 (높이x폭 반복)
        for(var i=0; i<inH; i++) {
            for (var k=0; k<inW; k++) {
                var sPixel=(i*inH + k); // 시작 위치
                var ePixel=(i*inH + k) + 1; // 끝위치
                inImage[i][k] = blob.slice(sPixel, ePixel).charCodeAt(0); // '꽯'를 숫자(233)으로 변경;
                saveImage[i][k] = inImage[i][k];
            }
        }
        displayImage();
    }

}

function displayImage() {
    inPaper = inCtx.createImageData(inH, inW); // 빈 종이 준비
    for(var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            var px = inImage[i][k]; 
            inPaper.data[ (i*inH +k)*4 + 0] = px; // Red
            inPaper.data[ (i*inH +k)*4 + 1] = px; // Green
            inPaper.data[ (i*inH +k)*4 + 2] = px; // Blue
            inPaper.data[ (i*inH +k)*4 + 3] = 255; // Alpha
        }
    }
    inCtx.putImageData(inPaper,0,0);// 종이를 캔버스(0,)에 붙이기

    outPaper = outCtx.createImageData(outH, outW); // 빈 종이 준비
    for(var i=0; i<outH; i++) {
        for (var k=0; k<outW; k++) {
            var px = outImage[i][k]; 
            outPaper.data[ (i*outH +k)*4 + 0] = px; // Red
            outPaper.data[ (i*outH +k)*4 + 1] = px; // Green
            outPaper.data[ (i*outH +k)*4 + 2] = px; // Blue
            outPaper.data[ (i*outH +k)*4 + 3] = 255; // Alpha
        }
    }
    outCtx.putImageData(outPaper,0,0);// 종이를 캔버스(0,)에 붙이기
}

// 영상처리 알고리즘 함수부
function selectAlgo(selNum) {
    switch (parseInt(selNum.value)) {
        case 100 : equalImage(); break; // 동일 영상
        case 101 : addImage(); break;
        case 102 : darkImage(); break;
        case 103 : reverseImage(); break;
        case 104 : blackImage(); break;
        case 105 : blackAvgImage(); break;
        case 106 : blckMidImage(); break;
        case 107 : gammaImage(); break;
        case 108 : rangeImage(); break;
        case 109 : parabolaCapImage(); break;
        case 110 : parabolaCupImage(); break;
        case 111 : binaryImage(); break;
        case 112 : posterImage(); break;


        case 201 : mirro1Image(); break;
        case 202 : mirro2Image(); break;
        case 203 : zoomOutImage(); break;
        case 204 : zoomInImage(); break;
        case 205 : zoomInBackImage(); break;
        case 206 : moveImage(); break;
        case 207 : rotateImage(); break;

        case 301 : histoStImage(); break;
        case 302 : endInImage(); break;
        case 303 : histoEqualImage(); break;



        case 401 : embosImage(); break;
        case 402 : blurImage(); break;
        case 403 : edgeImage(); break;
        case 404 : sharpImage(); break;
        case 405 : gausianImage(); break;
        case 406 : highSharpImage(); break;
        case 407 : homogenImage(); break;
        case 408 : laplaImage(); break;
        case 409 : chaImage(); break;
        case 410 : logImage(); break;
        case 411 : dogImage(); break;



    }
}


// 동일영상
function equalImage() {

    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = inImage[i][k];
        }
    }
    displayImage();
}

// 포스터라이징 명암 값 범위를 경계값으로 축소
function posterImage() {
    var value = parseInt(prompt("경계 값을 입력하세요")); 
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    var edge_value = 255/value;
    
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            cnt = 0;
            for(;edge_value*cnt<inImage[i][k];cnt++){
                if(edge_value*cnt>255)
                    outImage[i][k] = 255;
                else if(edge_value*cnt<0)
                    outImage[i][k] = 0;
                else   
                    outImage[i][k] = cnt*edge_value;
            }

        }
    }

    displayImage();
}

// 이진화. 경계 값을 이용해 값이 2개인 영상으로 변환
function binaryImage() {
    var value = parseInt(prompt("경계 값을 입력하세요"));

    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if(inImage[i][k]>=value)
                outImage[i][k] = 255;
            else if(inImage[i][k]<value)
                outImage[i][k] = 0;
        }
    }
  
    displayImage();
}

// 좌우반전
function mirro1Image() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][inW-1-k] = inImage[i][k];
        }
    }
    displayImage();
}

// 엠보싱
function embosImage() {
  // 중요! 출력 영상의 크기를 계산
  outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [-1.0, 0.0, 0.0], 
                    [ 0.0, 0.0, 0.0], 
                    [ 0.0, 0.0, 1.0] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }
    // 후처리 :마스크 합계가 0이라면 127 정도를 더하기.
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            tmpOutput[i][k] += 127.0; 
    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            outImage[i][k] = parseInt(tmpOutput[i][k]);
    displayImage();
}

// 블러링 
function blurImage() {
 
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요) 마스크 전제조건 : 홀수. 중간이 있어야 함. 
    var mask = [     [1./9., 1./9., 1./9.], 
                    [ 1/9., 1/9., 1/9.], 
                    [ 1/9., 1/9., 1/9.] ];


    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
              
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
    displayImage();
}

// 경계값
function edgeImage() {
  // 중요! 출력 영상의 크기를 계산
  outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요) 마스크 전제조건 : 홀수. 중간이 있어야 함. 
    var mask = [    [ 0., -1., 0.], 
                    [ -1., 2., 0.], 
                    [ 0., 0., 0.] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }
    // 후처리 :마스크 합계가 0이라면 127 정도를 더하기.
    // for (var i=0; i<outH; i++) 
    //     for (var k=0; k<outW; k++) 
    //         tmpOutput[i][k] += 127.0; 
    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            outImage[i][k] = parseInt(tmpOutput[i][k]);
    displayImage();
}

// 샤프닝
function sharpImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [-1, -1., -1.], 
                    [ -1., 9., -1.], 
                    [ -1., -1., -1.] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S +=  tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }
    // 후처리 :마스크 합계가 0이라면 127 정도를 더하기.
    // for (var i=0; i<outH; i++) 
    //     for (var k=0; k<outW; k++) 
    //         tmpOutput[i][k] += 127.0; 
    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            outImage[i][k] = parseInt(tmpOutput[i][k]);
    displayImage();
}

// 가우시안. 영상의 세세한 부분 제거해 부드럽게 스무딩.
function gausianImage(){
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요) 마스크 전제조건 : 홀수. 중간이 있어야 함. 
    var mask = [    [1/16., 1/8., 1/16.], 
                    [ 1/8., 1/4., 1/8.], 
                    [ 1/16., 1/8., 1/16.] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }
    // 후처리 :마스크 합계가 0이라면 127 정도를 더하기.
    // for (var i=0; i<outH; i++) 
    //     for (var k=0; k<outW; k++) 
    //         tmpOutput[i][k] += 127.0; 
    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            outImage[i][k] = parseInt(tmpOutput[i][k]);
    displayImage()
}

// 고주파 샤프닝(경계선을 두드러지게)
function highSharpImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [-1./9., -1./9., -1./9.], 
                    [ -1./9., 8./9., -1./9.], 
                    [ -1./9., -1./9., -1./9.] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S +=  100*tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) 
            outImage[i][k] = parseInt(tmpOutput[i][k]);
    displayImage();
}

// 차연산자 에지 검출 
function chaImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  


    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = inImage[i][k];

    // ** 진짜 영상처리 알고리즘 **
    
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);

    var pixel;
   
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            pixel = Math.max(
            Math.abs(tmpInput[i][k] - tmpInput[i+2][k+2]),
            Math.abs(tmpInput[i][k+2] - tmpInput[i+1][k]),
            Math.abs(tmpInput[i][k+1] - tmpInput[i+1][k+1]),
            Math.abs(tmpInput[i+1][k+2] - tmpInput[i+1][k]),
           );
           
            tmpOutput[i][k] = pixel;
        
            
        }
    }

    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
            
    displayImage();
}

// 유사연산자 에지 검출 
function homogenImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  


    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = inImage[i][k];

    // ** 진짜 영상처리 알고리즘 **
    
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);

    var pixel;
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                   if(Math.abs(tmpInput[i+1][k+1]-tmpInput[i+n][k+m])>=S)
                        S = Math.abs(tmpInput[i+1][k+1]-tmpInput[i+n][k+m]);
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
            
    displayImage();
}

// 라플라시안 
function laplaImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [ -1., -1., -1.], 
                    [ -1., 8., -1.], 
                    [ -1., -1., -1.] ];
    // 임시 입력 배열 (입력배열+2)
    var tmpInput = new Array(inH+2);
    for (var i=0; i<inH+2; i++)
        tmpInput[i] = new Array(inW+2);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+2; i++) 
        for (var k=0; k<inW+2; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+1][k+1] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<3; m++) {
                for(var n=0; n<3; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
    displayImage();
}

// LOG 
function logImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [ 0., 0., -1.,0.,0.], 
                    [  0., -1., -2.,-1.,0.], 
                    [  -1., -2., 16.,-2.,-1.],
                    [  0., -1., -2.,-1.,0.],
                    [  0., 0., -1.,0.,0.]

                ];
    // 임시 입력 배열 (입력배열+4) 5X5 마스크 연산
    var tmpInput = new Array(inH+4);
    for (var i=0; i<inH+4; i++)
        tmpInput[i] = new Array(inW+4);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+4; i++) 
        for (var k=0; k<inW+4; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+2][k+2] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<5; m++) {
                for(var n=0; n<5; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
    displayImage();
}

// DOG (7x7마스크)
function dogImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // (짱! 중요)
    var mask = [    [ 0., 0., -1.,-1.,-1.,0.,0.], 
                    [ 0., -2., -3.,-3.,-3.,-2.,0.], 
                    [ -1., -3., 5.,5.,5.,-3.,-1.],
                    [ -1., -3., 5.,16.,5.,-3.,-1.],
                    [ -1., -3., 5.,5.,5.,-3.,-1.],
                    [ 0., -2., -3.,-3.,-3.,-2.,0.],
                    [ 0., 0., -1.,-1.,-1.,0.,0.]

                ];
    // 임시 입력 배열 (입력배열+6) 7X7 마스크 연산
    var tmpInput = new Array(inH+6);
    for (var i=0; i<inH+6; i++)
        tmpInput[i] = new Array(inW+6);
    // 임시 입력 배열 초기화(127로)
    for (var i=0; i<inH+6; i++) 
        for (var k=0; k<inW+6; k++) 
            tmpInput[i][k] = 127.0;
    // 원 입력 --> 임시 입력.. 가운데 쏙~
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            tmpInput[i+3][k+3] = parseFloat(inImage[i][k]);
    // 임시 출력 배열 (출력배열 크기 동일)
    var tmpOutput = new Array(outH);
    for (var i=0; i<outH; i++)
        tmpOutput[i] = new Array(outW);
    // **** 회선 연산 ***
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            // 한 점에 대해서 처리
            var S = 0.0;
            for(var m=0; m<7; m++) {
                for(var n=0; n<7; n++) {
                    S += tmpInput[i+m][k+n] * mask[m][n]
                }
            }
            tmpOutput[i][k] = S;
        }
    }

    // 임시 출력 --> 원 출력
    for (var i=0; i<outH; i++) 
        for (var k=0; k<outW; k++) {
            if(tmpOutput[i][k]>255)
                outImage[i][k] = 255;

            else if(tmpOutput[i][k]<0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = parseInt(tmpOutput[i][k]);
        }
    displayImage();
}
// 히스토그램 스트래칭
function histoStImage() { 
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // outImage = (inImage - low) / (high - low)  * 255
    var low=inImage[0][0], high=inImage[0][0];
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if (inImage[i][k] < low)
                low = inImage[i][k];
            if (inImage[i][k] > high)
                high = inImage[i][k];
        }
    }  
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = (inImage[i][k] - low) / (high - low) * 255;
        }
    }
    displayImage();
}

// 엔드-인 탐색
function endInImage() { 
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    // outImage = (inImage - low) / (high - low)  * 255
    var low=inImage[0][0], high=inImage[0][0];
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if (inImage[i][k] < low)
                low = inImage[i][k];
            if (inImage[i][k] > high)
                high = inImage[i][k];
        }
    }  
    low += 50;
    high -= 50;

    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = (inImage[i][k] - low) / (high - low) * 255;
        }
    }
    displayImage();
}

// 히스토그램 평활화
function histoEqualImage() {
// 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);

    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  

    // ** 진짜 영상처리 알고리즘 **
    // 1단계 : 히스토그램 생성
    var histo = new Array(256); // 0~255까지 픽셀 값 종류
    for( var i=0; i<256; i++) // 초기화
        histo[i] = 0;
    for (var i=0; i<inH; i++) 
        for (var k=0; k<inW; k++) 
            histo[inImage[i][k]] ++;

    // 2단계 : 누적 히스토그램 생성
    var sumHisto = new Array(256); // 0~255까지 픽셀 값 종류
    for( var i=0; i<256; i++) // 초기화
        sumHisto[i] = 0;
    var sumValue = 0;
    for (var i=0; i<256; i++) {
        sumValue += histo[i];
        sumHisto[i] = sumValue;
    }

    // 3단계 : 정규화된 누적합 생성
    // normal[i] = sumHisto[i] * ( 1 / (inH*inW) ) * 255
    var normalHisto = new Array(256); 
    for( var i=0; i<256; i++) // 초기화
        normalHisto[i] = 0.0;
    for( var i=0; i<256; i++) {
        normalHisto[i] = sumHisto[i] * ( 1.0 / (inH*inW) ) * 255.0;
    }
    // 최종 : 정규화된 히스토그램을 적용시켜서 픽셀값을 변환
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = parseInt(normalHisto[inImage[i][k]]);
        }
    }
    displayImage();
}

// 좌우반전
function mirro1Image() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][inW-1-k] = inImage[i][k];
        }
    }
    displayImage();
}

// 상하반전
function mirro2Image() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[inH-1-i][k] = inImage[i][k];
        }
    }
    displayImage();
}


// 축소
function zoomOutImage() {
    var scale = parseInt(prompt("축소배율", 2));

    // 중요! 출력 영상의 크기를 계산
    outH = parseInt(inH/scale);
    outW = parseInt(inW/scale);

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  

    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[parseInt(i/scale)][parseInt(k/scale)] = inImage[i][k];
        }
    }

    displayImage();
}

// 확대
function zoomInImage() {
    var scale = parseInt(prompt("확대배율", 2));

    // 중요! 출력 영상의 크기를 계산
    outH = parseInt(inH*scale);
    outW = parseInt(inW*scale);

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  

    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[parseInt(i*scale)][parseInt(k*scale)] = inImage[i][k];
        }
    }
    displayImage();
}

// 확대 백워딩 
function zoomInBackImage() {
    var scale = parseInt(prompt("확대배율", 2));

    // 중요! 출력 영상의 크기를 계산
    outH = parseInt(inH*scale);
    outW = parseInt(inW*scale);

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  

    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<outH; i++) {
        for (var k=0; k<outW; k++) {
            outImage[i][k] = inImage[parseInt(i/scale)][parseInt(k/scale)];
        }
    }
    displayImage();
}

// 감마처리 
function gammaImage(){
    var gamma = parseFloat(prompt("감마값"));
    var temp;
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);

    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW; 
    temp = new Array(inH*inW);
  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<outH; i++) {
        for (var k=0; k<outW; k++) {
            //outImage[i][k] = ((inImage[i][k]/255)^(1/gamma))*255+0.5;
            //temp = (inImage[i][k])^(1/gamma)*255;
            //temp = 255*(Math.pow(inImage[i][k]/255, gamma));
            temp = Math.pow(inImage[i][k],1/gamma);
            
            if(temp<0)
                outImage[i][k] = 0;
            else if(temp>255)
                outImage[i][k] = 255;
            else    
                outImage[i][k] = temp;
        
    }
    displayImage();
    }
}

// 범위 강조 (입력값이 강조 시작 값과 강조 종료 값 사이에 위치->255)
function rangeImage(){
    var [start_val, end_val] = prompt("두 숫자를 입력하세요: ").split(" ")

    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);

    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW; 
    
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<outH; i++) {
        for (var k=0; k<outW; k++) {
            if(inImage[i][k]>=start_val && inImage[i][k]<=end_val)
                outImage[i][k] = 255;
            else    
                outImage[i][k] = inImage[i][k];
        }
    }
    displayImage();


    
}

// 어두운 곳이 입체적으로
function parabolaCupImage(){
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = 255*Math.pow((inImage[i][k]/127-1),2);
    }
    displayImage();
    }
}

// 밝은 곳이 입체적으로
function parabolaCapImage(){
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = 255 - 255*Math.pow((inImage[i][k]/127-1),2);
    }
    displayImage();
    }
}

// 이동
function moveImage(){
    // 중요! 출력 영상의 크기를 계산
    var[x,y] = prompt("x y 좌표 입력").split(" ")
;
    var tmpAry;
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);

        // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    var rx, ry;
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            rx = i - x;
            ry = k - y;
            if(rx>=0&&rx<inW&&ry>=0&&ry<inH)
                outImage[i][k] = inImage[rx][ry]; 
    }
    displayImage();
    }
}

// 회전
function rotateImage() {
    var degree = prompt("회전할 각도");

    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;

    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    var radian = degree*Math.PI/180;

    var cx = outH/2;
    var cy = outW/2;

    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
 
    // ** 진짜 영상처리 알고리즘 **
    var newH, newW;
    for (var i=0; i<outH; i++) {
        for (var k=0; k<outW; k++) {
            newH = parseInt(Math.cos(radian)*(i-cx)
            - Math.sin(radian)*(k-cy)+cx/outH*inH);

            newW = parseInt(Math.sin(radian)*(i-cx)
            + Math.cos(radian)*(k-cy)+cy/outW*inW);

            if(newH>=0&&newH<outH&&newW>=0&&newW<outW)
                outImage[i][k] = inImage[newH][newW];

        }

    }
    displayImage();
}


// 밝기
function addImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    var value = parseInt(prompt("밝게하기", "정수값 -->"));
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if (inImage[i][k] + value > 255)
                outImage[i][k] = 255;
            else
                outImage[i][k] = inImage[i][k] + value;
        }
    }
    displayImage();
}

function darkImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    var value = parseInt(prompt("어둡게하기", "정수값 -->"));
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if (inImage[i][k] - value < 0)
                outImage[i][k] = 0;
            else
                outImage[i][k] = inImage[i][k] - value;
        }
    }
    displayImage();
}

// 반전
function reverseImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            outImage[i][k] = 255 - inImage[i][k];
        }
    }
    displayImage();
}

// 흑백
function blackImage() {
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if(inImage[i][k] > 128)
                outImage[i][k] = 255;
            else    
                outImage[i][k] = 0;
        }
    }
    displayImage();
}

// 흑백 평균값 기준
function blackAvgImage() {
    var avg = 0; var sum = 0;
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            sum += inImage[i][k];
        }
    }

    avg = sum / (inH*inW);
    
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if(inImage[i][k] > avg)
                outImage[i][k] = 255;
            else    
                outImage[i][k] = 0;
        }
    }
    displayImage();
}

// 흑백 중앙값  
function blckMidImage(){
    var tmpAry = new Array(inH*inW);
    var index = 0;
    // 중요! 출력 영상의 크기를 계산
    outH = inH;
    outW = inW;
    // 이미지 크기의 2차원 메모리 할당(확보)
    outImage = new Array(outH);
    for (var i=0; i<outH; i++)
        outImage[i] = new Array(outW);
    // 캔버스 크기 지정
    outCanvas.height = outH;
    outCanvas.width = outW;  
    // ** 진짜 영상처리 알고리즘 **
    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            tmpAry[index++] = inImage[i][k];
            }

        }
    tmpAry.sort();
    var avg_val = tmpAry[parseInt((inH*inW))/2];

    for (var i=0; i<inH; i++) {
        for (var k=0; k<inW; k++) {
            if(inImage[i][k] > avg_val)
                outImage[i][k] = 255;
            else    
                outImage[i][k] = 0;
        }
    }

    displayImage();
}


