function statment(invoice, plays) {
    const statmentData = {};
    statmentData.customer = invoice.customer;   // 고객 데이터를 중간 데이터로 옮김
    statmentData.performances = invoice.performances.map(enrichPerformance);   // 공연 정보를 중간 데이터로 옮김
    return renderPlainText(statmentData, plays); 
}

function enrichPerformance(aPerformance) {
    const result = Object.assign({}, aPerformance); // 얕은 복사 수행
    result.play = playFor(result);      // 중간데이터에 연극 정보를 저장
    return result;
}

function renderPlainText(data, plays) {
    let result = '청구 내역 (고객명: ${data.customer})\n' // 고객 데이터를 중간 데이터로 옮김
    
    for (let perf of data.performances) {
        
        // 청구 내역을 출력한다.
        result += ' ${playFor(perf).name}: ${usd(amoutFor(perf))} ($perf.audience}석\n';
    }
    
    result += '총액: ${usd(totalAmount())}\n'; // 임시 변수였던 format을 함수 호출로 대체
    result += '적립 포인트: ${totalVolumeCredits()}점\n';
    return result;
}

function totalAmount() {
    let result = 0;
    for (let perf of data.performances) {
        result += amoutFor(perf);
    }
    return result;
}

function totalVolumeCredits() {
    let result = 0;
    for (let perf of data.performances) {
        result += volumeCreditsFor(perf);    // 추출한 함수를 통해 값을 누적
    }
    return result;
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-Us",
                {style: "currency", currency: "USD",
                minimumFractionDigits: 2}).format(aNumber/100);
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if("comedy" === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5);
    return result;

}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function amoutFor(aPerformance) {
    let result = 0;

    switch(playFor(aPerformance).type) {
    case "tragedy" :    // 비극
        result = 40000;
        if(aPerformance.audience > 30){
            result += 1000 * (aPerformance.audience - 30);
        }
        break;
    case "comedy" :
        result = 30000;
        if(aPerformance.audience > 20){
            result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
    default:
        throw new Error('알 수 없는 경로: ${playFor(aPerformance).type}');
    }

    return result;

}
