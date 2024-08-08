const corroborate = (time, duration) => {
    let contador = 0
    let available = false
    time.forEach(element => {
        
        if (element.applicant == "free") {
            contador++
        } else {
            contador = 0
        }
        if (contador == duration) {
            available = true
        }
    });
    return available
}

module.exports = corroborate