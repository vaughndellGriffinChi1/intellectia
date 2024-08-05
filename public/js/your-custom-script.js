document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      editable: true,
      events: [
        {
          title: 'Event 1',
          start: '2023-07-20'
        },
        {
          title: 'Event 2',
          start: '2023-07-22'
        }
      ],
      dateClick: function(info) {
        var eventTitle = prompt('Enter Event Title:');
        if (eventTitle) {
          calendar.addEvent({
            title: eventTitle,
            start: info.dateStr,
            allDay: true
          });
        }
      },
      eventClick: function(info) {
        var updateTitle = prompt('Update Event Title:', info.event.title);
        if (updateTitle) {
          info.event.setProp('title', updateTitle);
        }
      }
    });
  
    calendar.render();
  });
  