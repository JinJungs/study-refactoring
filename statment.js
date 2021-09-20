import createStatmentData from './createStatmentData.js';

function statment(invoice, plays) {
    return renderPlainText(createStatmentData(invoice, plays));
}


function renderPlainText(data, plays) {
    let result = '청구 내역 (고객명: ${data.customer})\n' // 고객 데이터를 중간 데이터로 옮김
    
    for (let perf of data.performances) {
        
        result += ' ${perf.play.name}: ${usd(perf.amount)} ($perf.audience}석)\n';
    }
    
    result += '총액: ${usd(data.totalAmount)}\n'; // 임시 변수였던 format을 함수 호출로 대체
    result += '적립 포인트: ${data.totalVolumeCredits}점\n';
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-Us",
                {style: "currency", currency: "USD",
                minimumFractionDigits: 2}).format(aNumber/100);
}

