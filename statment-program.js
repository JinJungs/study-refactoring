function statment(invoice, plays) {
    let totalAmount = 0;
    let result = '청구 내역 (고객명: ${invoice.customer})\n'
    
    for (let perf of invoice.performances) {
        
        // 청구 내역을 출력한다.
        result += ' ${playFor(perf).name}: ${usd(amoutFor(perf))} ($perf.audience}석\n';
        totalAmount += amoutFor(perf);
    }

    result += '총액: ${usd(totalAmount/100)}\n'; // 임시 변수였던 format을 함수 호출로 대체
    result += '적립 포인트: ${totalVolumeCredits()}점\n';
    return result;
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

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if("comedy" === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5);
    return result;

}

function usd(aNumber) {
    return new Intl.NumberFormat("en-Us",
                {style: "currency", currency: "USD",
                minimumFractionDigits: 2}).format(aNumber/100);
}

function totalVolumeCredits() {
    let volumeCredits = 0;
    for (let perf of invoice.performances) {
        volumeCredits += volumeCreditsFor(perf);    // 추출한 함수를 통해 값을 누적
    }
    return volumeCredits;
}