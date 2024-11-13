
// ----------- RENDERIZA TODOS OS DADOS DA MOCKAPI ------------------ //
async function loadCars () {

    const res  = await fetch('https://673502e05995834c8a91ab68.mockapi.io/autotrack/cars')
    const data = await res.json()

    if(data.length > 0) {

        const table = document.getElementById('table')
        const main  = document.getElementById('main')
        const thead = document.createElement('thead')
        const tbody = document.createElement('tbody')

        //limpando a tabela para cada chamada da função.
        table.innerHTML = ''
        
        //thead é fixa.
        thead.innerHTML = `<tr>
                            <td>Marca</td>
                            <td>Modelo</td>
                            <td>Cor</td>
                            <td>Ano</td>
                            <td colspan="2">Opçoes</td>
                        </tr>`
        table.appendChild(thead)

        data.forEach(car => {

            const tr          = document.createElement('tr')

            const tdMark      = document.createElement('td')
            tdMark.innerText  = car.mark

            const tdModel     = document.createElement('td')
            tdModel.innerText = car.model

            const tdColor     = document.createElement('td')
            tdColor.innerText = car.color

            const tdYear     = document.createElement('td')
            tdYear.innerText = car.year

            const tdEdit     = document.createElement('td')
            tdEdit.innerHTML = `<button class="option-btn" data-car-id="${car.id}">Editar</button>`

            const tdDelete   = document.createElement('td')
            tdDelete.innerHTML = `<button class="option-btn delete" data-car-id="${car.id}">Excluir</button>`

            tr.appendChild(tdMark);
            tr.appendChild(tdModel);
            tr.appendChild(tdColor);
            tr.appendChild(tdYear);
            tr.appendChild(tdEdit)
            tr.appendChild(tdDelete)

            tbody.appendChild(tr)
            
        });

        table.appendChild(tbody)
        main.appendChild(table)

    }

    //não há dados??
    else {
        const div = document.createElement('div');
        div.classList.add('no-data');
        div.innerText = "Não há dados para exibir.";

        main.appendChild(div)
    }
}
loadCars()