import React, { useEffect, useRef, useState } from 'react';
import Highcharts from 'highcharts';
import { openmrsFetch } from '@openmrs/esm-framework';
import { getPatientUuidFromStore } from '../store/patient-chart-store';
import loadingImage from '../resources/assets/loading.gif';
import styles from '../root.scss';

const PateintTreatmentChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const [mychartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const patientUuid = getPatientUuidFromStore();

  console.log('patientUuid ' + patientUuid);

  interface PatientFlagResponse {
    // You can type this more strictly if you know the response structure
    [key: string]: any;
  }
  const getPatientFlagData = async () => {
    try {
      console.log('Fetching patient flag...');

      const { data } = await openmrsFetch<PatientFlagResponse>(
        `/ws/rest/v1/customuinmrs/patientflags?v=full&patient=${patientUuid}`,
      );
      //console.log('Patient flag data:', data);
      var flagDataJSON = data.results[0].chartdata;
      var flagData = JSON.parse(flagDataJSON);

      if (flagData.hasOwnProperty('nextappointmentbeforelastone')) {
        if (flagData.nextappointmentbeforelastone != 'NA') {
          var apptcompliance = document.getElementById('apptcompliance');
          if (flagData.nextappointmentbeforelastone == 'Red') {
            apptcompliance.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
          }
          if (flagData.nextappointmentbeforelastone == 'Green') {
            apptcompliance.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
          }
          if (flagData.nextappointmentbeforelastone == 'Yellow') {
            apptcompliance.style.setProperty('background', 'linear-gradient(to right, yellow, white)', 'important');
          }
          apptcompliance.style.setProperty('color', '#fff', 'important');
          document.getElementById('lastdrugpickup').innerText = flagData.lastdrugpickupdate;
        }
      }

      if (flagData.vlflag != 'NA') {
        var vlflagbg = document.getElementById('vlflagbg');
        if (flagData.vlflag == 'Red') {
          vlflagbg.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
        }
        if (flagData.vlflag == 'Green') {
          vlflagbg.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
        }
        if (flagData.vlflag == 'Yellow') {
          vlflagbg.style.setProperty('background', 'linear-gradient(to right, yellow, white)', 'important');
        }
        vlflagbg.style.setProperty('color', '#fff', 'important');
        document.getElementById('vlflag').innerText = flagData.currentvl + 'cp/ml ' + flagData.dateofcurrentvl;
      }

      if (flagData.dateEligibleVLflag != 'NA') {
        var dateEligibleVLbg = document.getElementById('dateEligibleVLbg');
        if (flagData.dateEligibleVLflag == 'Red') {
          dateEligibleVLbg.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
        }
        if (flagData.dateEligibleVLflag == 'Green') {
          dateEligibleVLbg.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
        }
        if (flagData.dateEligibleVLflag == 'Yellow') {
          dateEligibleVLbg.style.setProperty('background', 'linear-gradient(to right, yellow, white)', 'important');
        }
        dateEligibleVLbg.style.setProperty('color', '#fff', 'important');
        document.getElementById('dateEligibleVL').innerText = flagData.dateEligibleVL;
      }

      if (flagData.hasOwnProperty('bloodsugar')) {
        if (flagData.bloodsugar != 'NA') {
          var bloodsugarbg = document.getElementById('bloodsugarbg');
          if (flagData.bloodsugar == 'Red') {
            bloodsugarbg.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
          }
          if (flagData.bloodsugar == 'Green') {
            bloodsugarbg.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
          }
          if (flagData.bloodsugar == 'Yellow') {
            bloodsugarbg.style.setProperty('background', 'linear-gradient(to right, yellow, white)', 'important');
          }
          bloodsugarbg.style.setProperty('color', '#fff', 'important');
          document.getElementById('bloodsugar').innerText = flagData.bloodsugar;
        }
      }

      if (flagData.hasOwnProperty('bloodpressure')) {
        if (flagData.bloodpressure != 'NA') {
          var bloodpressurebg = document.getElementById('bloodpressurebg');
          if (flagData.bloodpressure == 'high') {
            bloodpressurebg.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
          }
          if (flagData.bloodpressure == 'normal') {
            bloodpressurebg.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
          }
          if (flagData.bloodpressure == 'prehigh') {
            bloodpressurebg.style.setProperty('background', 'linear-gradient(to right, yellow, white)', 'important');
          }
          bloodpressurebg.style.setProperty('color', '#fff', 'important');
          document.getElementById('bloodpressure').innerText = flagData.bloodpressurevalue;
        }
      }

      if (flagData.biomtetricstatus != 'NA') {
        var biomtetricstatusbg = document.getElementById('biomtetricstatusbg');

        if (flagData.biomtetricstatus == 'Yes') {
          biomtetricstatusbg.style.setProperty('background', 'linear-gradient(to right, green, white)', 'important');
        } else {
          biomtetricstatusbg.style.setProperty('background', 'linear-gradient(to right, red, white)', 'important');
        }
        biomtetricstatusbg.style.setProperty('color', '#fff', 'important');
        document.getElementById('biomtetricstatus').innerText = flagData.biomtetricstatus;
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch patient flag data');
    } finally {
      setLoading(false);
    }
  };

  interface PatientChartResponse {
    // You can type this more strictly if you know the response structure
    [key: string]: any;
  }
  const getPatientChartData = async () => {
    try {
      console.log('📡 Fetching patient chart...');

      const { data } = await openmrsFetch<PatientChartResponse>(
        `/ws/rest/v1/customuinmrs/patientchart?v=full&patient=${patientUuid}`,
      );
      console.log('✅ Patient Chart Data:', data);

      const colorBlue = '#007bff';
      const colorGreen = '#28a745';
      const colorRed = '#dc3545';
      const colorYellow = '#ffc107';
      const colorBlack = '#000000';

      var minDate = new Date();
      var maxDate = new Date();
      var iitData = new Array();

      var dosesRemaing = new Array();
      var dosesWithSurplus = new Array();
      var vlLessThan50 = [];
      var vl50_999 = [];
      var vlAbove999 = [];
      var pickupDot = []; //this is used to have dots at every drug pickup
      var vlDots = { vlLessThan50: [], vl50_999: [], vlAbove999: [] }; //this is used to have dots on the vl lines
      var regimenData = [];

      var maxPickup = 0; //this is used to know what the max height for the left y axis should be. i.e the highest days of refill the patient has ever had. plus surplus

      const obj = data;
      console.log('OBJ ' + obj);
      var chartDataJSON = obj.results[0].chartdata;
      var chartData = JSON.parse(chartDataJSON);

      var viralLoadData = JSON.parse(chartData.viral_load);
      if (viralLoadData !== null) {
        var tempData = viralLoadData.data; // Assuming data.viral_load is a correctly formatted JSON string
        for (var i = 0; i < tempData.length; i++) {
          var vlDate = new Date(tempData[i]['date_actual']);
          var vlResult = tempData[i]['VLresult'];

          // Log all VLresult values
          console.log(`VLresult: ${vlResult}`); // Logs each VLresult

          // Categorizing based on VLresult value
          if (vlResult < 50) {
            vlLessThan50.push({ x: vlDate.getTime(), y: vlResult });
            vlDots['vlLessThan50'].push({ y: vlResult, x: vlDate.getTime() });
          } else if (vlResult >= 50 && vlResult < 1000) {
            vl50_999.push({ x: vlDate.getTime(), y: vlResult });
            vlDots['vl50_999'].push({ y: vlResult, x: vlDate.getTime() });
          } else {
            vlAbove999.push({ x: vlDate.getTime(), y: vlResult });
            vlDots['vlAbove999'].push({ y: vlResult, x: vlDate.getTime() });
          }
        }
      }

      var dosageLoadData = JSON.parse(chartData.dosage);

      if (dosageLoadData !== null) {
        // console.log("dosage", data.dosage);
        var tempData = dosageLoadData.data; //response.data;
        var previousPickup = 0;
        for (var i = 0; i < tempData.length; i++) {
          var date = new Date(tempData[i]['index']);
          var dosesLeft = tempData[i]['pills_remaining'];
          var dosesLeftWithSurplus = tempData[i]['incl_surplus'];
          maxPickup = Math.max(dosesLeftWithSurplus, maxPickup);

          minDate = date.getTime() < minDate.getTime() ? date : minDate;
          maxDate = date.getTime() > maxDate.getTime() ? date : maxDate;
          dosesRemaing.push({ x: date.getTime(), y: dosesLeft });
          dosesWithSurplus.push({ x: date.getTime(), y: dosesLeftWithSurplus });

          if (previousPickup < new Number(dosesLeft)) {
            console.log(previousPickup, dosesLeft);

            pickupDot.push({ y: dosesLeft, x: date.getTime() });
          }
          previousPickup = dosesLeft;
        }
      }

      // var iitLoadData = JSON.parse(chartData.iit);
      // // console.log("pickup", pickupDot);
      // if (iitLoadData !== null) {
      //   // console.log("iit",response);
      //   var tempData = iitLoadData.data;
      //   for (var i = 0; i < tempData.length; i++) {
      //     if (tempData[i]['IIT'] == 1) {
      //       var totalDaysIIT = tempData[i]['IIT_duration'];
      //       var endDate = new Date(tempData[i]['date_actual']);
      //       var startDate = new Date(endDate);
      //       endDate.setDate(endDate.getDate() - totalDaysIIT);
      //
      //       console.log('IIT :' + totalDaysIIT, startDate);
      //
      //       iitData.push({
      //         color: colorYellow,
      //         from: startDate.getTime(), //Date.UTC(2016,10,28),
      //         to: endDate.getTime(), //Date.UTC(2017,1,9 ),
      //         label: {
      //           text: 'IIT:' + totalDaysIIT + ' days',
      //           align: 'left',
      //          /* verticalAlign: 'top',
      //           rotation: 0, // Keep horizontal
      //           style: {
      //             color: '#000',
      //             fontWeight: 'bold',
      //           },*/
      //           /*align: 'center',  */
      //         },
      //       });
      //     }
      //   }
      // }

      var iitLoadData = JSON.parse(chartData.iit);
      // console.log("pickup", pickupDot);
      if (iitLoadData !== null) {
        // console.log("iit",response);
        var tempData = iitLoadData.data;
        for (var i = 0; i < tempData.length; i++) {
          if (tempData[i]['IIT'] == 1) {
            var totalDaysIIT = tempData[i]['IIT_duration'];
            var endDate = new Date(tempData[i]['date_actual']);
            var startDate = new Date(endDate);
            endDate.setDate(endDate.getDate() - totalDaysIIT);

            console.log('IIT :' + totalDaysIIT, startDate);

            iitData.push({
              color: colorYellow,
              from: startDate.getTime(), //Date.UTC(2016,10,28),
              to: endDate.getTime(), //Date.UTC(2017,1,9 ),
              label: {
                text: 'IIT:' + totalDaysIIT + ' days',
                align: 'left',
                /*align: 'center',  */
              },
            });
          }
        }
      }

      var regimenLoadData = JSON.parse(chartData.regimen);
      if (regimenLoadData !== null) {
        var regData = regimenLoadData.data[0];
        console.log(regData);
        var date1 = new Date(regData['current_regiment_intiation']).getTime();
        var currRegimen = regData['current_art_regiment'];
        regimenData.push({ x: date1, y: 60, currRegimen: currRegimen });
      }

      const chartOptions: Highcharts.Options = {
        chart: {
          events: {
            load: function () {
              const gif = document.getElementById('loadingGif');
              if (gif) {
                gif.style.display = 'none';
              } // ✅ hide the gif

              const loadingGifdiv = document.getElementById('loadingGifdiv');
              if (loadingGifdiv) {
                loadingGifdiv.style.display = 'none';
              }

              //Get and Set ART start date
              var art_initiation = document.getElementById('art_initiation');
              if (art_initiation) {
                art_initiation.innerText = chartData.art_initiation;
              }

              //Get and set the IIT total
              var iit_total = document.getElementById('iit_total');
              if (iit_total) {
                iit_total.innerText = Math.round(chartData.iit_total).toString();
              }

              //Get and set the last_iit
              var last_iit = document.getElementById('last_iit');
              if (last_iit) {
                last_iit.innerText = Math.round(chartData.last_iit).toString() + ' days';
              }

              //Get and set the time_since_last_iit
              var time_since_last_iit = document.getElementById('time_since_last_iit');
              if (time_since_last_iit) {
                time_since_last_iit.innerText = Math.round(chartData.time_since_last_iit).toString() + ' days';
              }

              //Get and set the iit_prediction
              if (chartData.hasOwnProperty('iit_prediction')) {
                var iitprediction = (chartData.iit_prediction * 100).toFixed(2);
                const iit_prediction = document.getElementById('iit_predictionBg');
                if (iit_prediction) {
                  if (parseFloat(iitprediction) < 50) {
                    iit_prediction.style.setProperty('background-color', '#7bdcbc', 'important');
                    iit_prediction.style.setProperty('color', '#fff', 'important');
                  }
                  // if (parseFloat(iitprediction) >= 94.9 && parseFloat(iitprediction) < 50) {
                  //   iit_prediction.style.setProperty('background-color', '#e9e999', 'important');
                  //   iit_prediction.style.setProperty('color', '#000', 'important');
                  // }
                  if (parseFloat(iitprediction) >= 50 && parseFloat(iitprediction) < 94.9) {
                    iit_prediction.style.setProperty('background-color', '#e9e999', 'important');
                    iit_prediction.style.setProperty('color', '#000', 'important');
                  }
                  if (parseFloat(iitprediction) >= 95) {
                    iit_prediction.style.setProperty('background-color', '#DE9F9F', 'important');
                    iit_prediction.style.setProperty('color', '#000', 'important');
                  }
                  document.getElementById('iit_prediction').innerText = iitprediction + '%';
                }
              }
              //Get and set the iit_last_12_mnths
              const iit_last_12_mnths = document.getElementById('iit_last_12_mnths');
              if (iit_last_12_mnths) {
                iit_last_12_mnths.innerText = chartData.iit_last_12_mnths;
              }
            },
          },
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            label: { enabled: false },
          },
        },
        boost: { useGPUTranslations: true },
        title: { text: 'Treatment Response' },
        exporting: { enabled: false },
        xAxis: {
          type: 'datetime',
          min: minDate.getTime(),
          max: maxDate.getTime(),
          showLastLabel: false,
          tickLength: 0,
          tickWidth: 0,
          tickAmount: 1,
          minorTickLength: 0,
          plotBands: iitData,
        },
        tooltip: {
          xDateFormat: '%Y-%m-%d',
          shared: true,
        },
        yAxis: [
          {
            title: {
              text: 'Estimated doses remaining',
              style: { color: colorBlue },
            },
            labels: { format: '{value:,.0f}' },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: true,
            endOnTick: true,
            tickWidth: 0,
            min: 0,
            max: maxPickup,
            tickAmount: 1,
            lineColor: '#FF0000',
          },
          {
            type: 'logarithmic',
            tickAmount: 1,
            minorTickLength: 0,
            tickWidth: 0,
            title: { text: 'VL Result' },
            opposite: true,
            gridLineColor: '#ffffff',
            labels: {
              formatter: function () {
                return this.value?.toString() ?? '';
              },
            },
          },
        ],
        series: [
          {
            id: 'remaining_doses',
            name: 'Including surplus',
            data: dosesWithSurplus,
            yAxis: 0,
            type: 'line',
            color: colorBlue,
          },
          {
            id: 'remaining_doses2',
            name: 'Doses Remaining',
            data: dosesRemaing,
            yAxis: 0,
            type: 'line',
            color: colorGreen,
          },
          {
            name: 'VL >= 1000',
            data: vlAbove999,
            yAxis: 1,
            zIndex: 9999999,
            type: 'column',
            color: colorRed,
            borderColor: colorRed,
            borderWidth: 2,
            dataLabels: { enabled: true },
          },
          {
            name: 'vlAbove999',
            data: vlDots.vlAbove999,
            type: 'scatter',
            color: colorRed,
            marker: { symbol: 'round', radius: 6 },
            yAxis: 1,
            showInLegend: false,
            dataLabels: { enabled: true },
          },
          {
            name: 'VL 51-999',
            data: vl50_999,
            type: 'column',
            color: colorYellow,
            borderColor: colorYellow,
            yAxis: 1,
            dataLabels: { enabled: true },
          },
          {
            name: 'vl50_999',
            data: vlDots.vl50_999,
            type: 'scatter',
            color: colorYellow,
            marker: { symbol: 'round', radius: 6 },
            yAxis: 1,
            showInLegend: false,
            dataLabels: { enabled: true },
          },
          {
            name: 'VL <= 50',
            data: vlLessThan50,
            type: 'column',
            color: colorBlack,
            borderColor: colorBlack,
            yAxis: 1,
            dataLabels: { enabled: true },
          },
          {
            name: 'VLDotBelow50',
            data: vlDots.vlLessThan50,
            type: 'scatter',
            color: colorBlack,
            marker: { symbol: 'round', radius: 6 },
            yAxis: 1,
            showInLegend: false,
            dataLabels: { enabled: true },
          },
          {
            name: 'Regimens',
            data: regimenData,
            type: 'scatter',
            yAxis: 0,
            color: colorRed,
            zIndex: 2,
            marker: {
              symbol: `url(/openmrs/ms/uiframework/resource/customuinmrs/iit_prediction/regicon.png)`,
              width: 30,
              height: 30,
            },
            dataLabels: {
              enabled: true,
              formatter: function () {
                return this['currRegimen'];
              },
            },
          },
          {
            name: 'Pickups',
            data: pickupDot,
            type: 'scatter',
            yAxis: 0,
            color: colorGreen,
            zIndex: 1,
            marker: { symbol: 'round' },
            showInLegend: false,
            dataLabels: { enabled: true },
          },
        ],
      };

      if (chartContainerRef.current) {
        Highcharts.chart(chartContainerRef.current, chartOptions);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to fetch patient chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPatientFlagData();
    getPatientChartData();
    console.log('Hiii');
  }, [patientUuid]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', padding: '5px' }}>Flags</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="apptcompliance">
          Appointment Compliance <span id="lastdrugpickup" className={styles.lastdrugpickup}></span>
        </div>
        <div style={{ flex: 1 }} className={styles.patientFlags} id="vlflagbg">
          Current Viral Status <span id="vlflag" className={styles.vlflag}></span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="dateEligibleVLbg">
          Date Eligible for Viral Laod <span id="dateEligibleVL" className={styles.dateEligibleVL}></span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="bloodsugarbg">
          Blood Sugar{' '}
          <span id="bloodsugar" className={styles.bloodsugar}>
            N/A
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="bloodpressurebg">
          Blood Pressure{' '}
          <span id="bloodpressure" className={styles.bloodpressure}>
            N/A
          </span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="tbstatusbg">
          TB Status{' '}
          <span id="tbstatus" className={styles.tbstatus}>
            {' '}
            N/A
          </span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="meningitisstatusbg">
          Cryptococcal Meningitis status{' '}
          <span id="meningitisstatus" className={styles.meningitisstatus}>
            {' '}
            N/A
          </span>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }} className={styles.patientFlags} id="biomtetricstatusbg">
          Finger print captured <span id="biomtetricstatus" className={styles.biomtetricstatus}></span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'rgb(3, 49, 34)',
            color: '#fff',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
        >
          ART Start Date <div id="art_initiation">00-00-0000</div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'rgb(3, 49, 34)',
            color: '#fff',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
        >
          No. IIT in the last 12 months <div id="iit_last_12_mnths">0</div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'rgb(3, 49, 34)',
            color: '#fff',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
        >
          Duration of last IIT <div id="last_iit">0 days</div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'rgb(3, 49, 34)',
            color: '#fff',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
        >
          Time Since last IIT <div id="time_since_last_iit">0 days</div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: 'rgb(3, 49, 34)',
            color: '#fff',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
        >
          IIT Total <div id="iit_total">0</div>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            backgroundColor: '#ddd',
            color: '#333',
            margin: '10px 5px',
            padding: '0.25em 0.4em',
            borderRadius: '0.25rem',
            fontSize: '75%',
            fontWeight: '700',
          }}
          id="iit_predictionBg"
        >
          IIT Prediction <div id="iit_prediction">0%</div>
        </div>
      </div>
      <div id="loadingGifdiv" style={{ textAlign: 'center' }}>
        <img id="loadingGif" src={loadingImage} width={50} height={50} />
      </div>
      <div id="container" ref={chartContainerRef} style={{ width: '100%', height: '500px', overflow: 'hidden' }} />
    </div>
  );
};

export default PateintTreatmentChart;
