const jsonInput = document.getElementById('jsonInput');
const procesarBtn = document.getElementById('procesarBtn');
const resultado = document.getElementById('resultado');

// Vector de remarks que no se toamaran en cuenta
const excludedRemarks = ['lu_goldenplus_mx_backup_hdvs5', 'lu_azteca_7hd_mx_backup_hdvs5', 'p03foxsports3sdvs5', 'b01arte1sdvs5', 
                         'b02loadinghdvs5', 'b02loadinghd2vs5', 'mdtv_pasiones_fhd', 'p03foxsports2sdvs5', 'p03espnplussdvs5',
                         'p03axnsdvs5','mdtv_pasiones_hd', 'p03fxsdvs5', 'p03starchannelsdvs5', 'p03telehithdvs5', 'p03mtvarribavs5',
			 'mdtv_studio_universal_mx_hd2', 'mdtv_hbo_family_mx_hd2'];

function concatenarRemarks(remarks) {
    return remarks.join(', ');
}

procesarBtn.addEventListener('click', () => {
    try {
        const jsonData = JSON.parse(jsonInput.value);

        const dcNames = ['B01', 'B02', 'P03', 'P32', 'LU'];
        const extraTags = ['NS_RU', 'MX01', 'NS_ZA', 'JMX', 'JEN', 'BRLE', 'JEN_ZA', 'JEN_LOCAL', 'JEN_PH', 'JOS_PH'];

        const filteredData = jsonData.result.filter(item => {
            return (
                item.bw === 0.0 &&
                item.streamStatus === 1 &&
                (dcNames.includes(item.dcName) || extraTags.some(tag => item.extraTag?.includes(tag))) &&
                !excludedRemarks.includes(item.remark) // Se evaluan si hay excludedRemarks
            );
        });

        const groupedData = {};
        let remarksNoFormato = {};

        filteredData.forEach(item => {
            const key = item.extraTag?.split(',')[0].trim() || item.dcName;

            if (!groupedData[key]) {
                groupedData[key] = [];
            }

            // Si el dcName o extraTag en ns, solo muestra el remark
            if (dcNames.includes(item.dcName) || ['NS_RU', 'MX01', 'NS_ZA'].some(tag => item.extraTag?.includes(tag))) {
                if (!remarksNoFormato[key]) {
                    remarksNoFormato[key] = [];
                }
                remarksNoFormato[key].push(item.remark);
            } 
            else if (['JMX', 'JEN', 'BRLE', 'JEN_ZA', 'JEN_LOCAL', 'JEN_PH', 'JOS_PH'].some(tag => item.extraTag?.includes(tag))) {
                groupedData[key].push(`${item.remark} ${item.urls[0] || "URL no disponible"}`);
            } else {
                groupedData[key].push(`${item.remark} ${item.urls[0] || "URL no disponible"}`);
            }
        });

        let remarksOutput = "";
        for (const key in remarksNoFormato) {
            remarksOutput += `<p><strong>${key}:</strong> ${concatenarRemarks(remarksNoFormato[key])}</p>`;
        }

        let output = "";
        for (const key in groupedData) {
            if (!remarksNoFormato[key]) {
                output += `<p class="font-bold">${key}:</p><ul>`;
                groupedData[key].forEach(item => {
                    output += `<li>${item}</li>`;
                });
                output += "</ul>";
            }
        }

        resultado.innerHTML = (remarksOutput || remarksNoFormato) ? remarksOutput + (output || "") : "<p>No se encontraron coincidencias.</p>";

    } catch (error) {
        resultado.textContent = "Error al procesar el JSON. Asegúrate de que el formato sea correcto.";
        console.error("Error al parsear JSON:", error);
    }
});
