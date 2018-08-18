export default function(time) {
     const now = new Date();
	const diff = new Date(now - time);
     if ((now.getYear() - time.getYear()) > 0) {
          return 'Poslední aktualizace před ' + Number(now.getYear() - time.getYear()) + ' rok';
     } else if (diff.getMonth() > 0) {
          return 'Poslední aktualizace před ' + diff.getMonth() + ' měsíc';
     } else if (diff.getDate() - 1 > 0) {
          return 'Poslední aktualizace před ' + diff.getDate() + ' dny';
     } else if (diff.getHours() > 1) {
          return 'Poslední aktualizace před ' + diff.getHours() + ' hod';
     } else if (diff.getMinutes() > 0) {
          return 'Poslední aktualizace před ' + diff.getMinutes() + ' min';
     }
}
