import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  EventApi,
  EventClickArg,
  formatDate,
} from "@fullcalendar/core/index.js";
import DeleteEventModal from "../modals/DeleteEventModal";
import AddEventModal from "../modals/AddEventModal";
import axios from "axios";

const CalendarEvents = () => {
  const theme = useTheme();
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(
    null
  );
  const [isDeleteEventDialogOpen, setIsDeleteEventDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateClickArg | null>(null);

  const isLargeMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/events");
      const events = response.data.map((event: any) => ({
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
      }));
      setCurrentEvents(events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info);
    setAddEventDialogOpen(true);
  };

  const handleAddEvent = async (title: string) => {
    const calendarApi = selectedDate?.view.calendar;
    calendarApi?.unselect();

    if (title && selectedDate) {
      try {
        const response = await axios.post("http://localhost:5000/api/events", {
          title,
          start: selectedDate.dateStr,
          allDay: selectedDate.allDay,
        });
        const newEvent = response.data;
        calendarApi?.addEvent({
          id: newEvent._id,
          title: newEvent.title,
          start: newEvent.start,
          allDay: newEvent.allDay,
        });
        setCurrentEvents((prevEvents) => [
          ...prevEvents,
          calendarApi?.getEventById(newEvent._id) as EventApi,
        ]);
      } catch (error) {
        console.error("Error adding event:", error);
      }
    }

    setAddEventDialogOpen(false);
  };

  const handleAddEventDialogClose = () => {
    setAddEventDialogOpen(false);
  };

  const handleEventClick = (selected: EventClickArg) => {
    setSelectedEvent(selected);
    setIsDeleteEventDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEvent) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${selectedEvent.event.id}`);
        selectedEvent.event.remove();
        setCurrentEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.event.id)
        );
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
    setIsDeleteEventDialogOpen(false);
  };

  const handleEvents = (events: EventApi[]) => {
    // Check if the events have actually changed before updating the state
    if (events.length !== currentEvents.length || !events.every((event, index) => event.id === currentEvents[index].id)) {
      setCurrentEvents(events);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteEventDialogOpen(false);
  };

  return (
    <>
      <Stack
        spacing={4}
        direction={{ xs: "column-reverse", md: "row" }}
        mt="40px"
      >
        <Paper
          sx={{
            flexShrink: 0,
            width: { xs: "100%", md: "20%" },
            maxHeight: { md: "calc(75vh + 30px)" },
            minHeight: { md: "calc(75vh + 30px)" },
          }}
        >
          <Typography variant="h4" align="center" color="secondary" pb="15px">
            Events
          </Typography>
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              maxHeight: { md: "calc(100% - 40px)" },
              p: "15px",
            }}
          >
            <List>
              <Grid
                container
                spacing={2}
                direction={{ xs: "row", md: "column" }}
              >
                {currentEvents.map((event) => (
                  <Grid item flexGrow={1} key={event.id}>
                    <ListItem
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color:
                          theme.palette.mode === "dark"
                            ? "inherit"
                            : "grey.100",
                        borderRadius: "4px",
                        py: 0,
                      }}
                    >
                      <ListItemText
                        sx={{
                          textAlign: "left",
                        }}
                        primary={
                          <Typography variant="h5">{event.title}</Typography>
                        }
                        secondary={
                          <Typography>
                            {formatDate(event.start!, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </Grid>
                ))}
              </Grid>
            </List>
          </Box>
        </Paper>
        <Box
          flexGrow={1}
          sx={{
            ".& fc-list-day-cushion .fc-cell-shaded": {
              backgroundColor: `inherit !impotant`,
            },
          }}
        >
          <Paper sx={{ p: "15px" }}>
            <FullCalendar
              handleWindowResize
              height="75vh"
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: `${
                  isLargeMobile
                    ? "dayGridMonth,timeGridDay,listMonth"
                    : "dayGridMonth,timeGridWeek,timeGridDay,listMonth"
                }`,
              }}
              initialView="dayGridMonth"
              selectLongPressDelay={200}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventsSet={handleEvents}
              events={currentEvents.map(event => ({
                id: event.id,
                title: event.title,
                start: event.start ? event.start.toISOString() : undefined,
                end: event.end ? event.end.toISOString() : undefined,
                allDay: event.allDay,
              }))}
            />
          </Paper>
        </Box>
      </Stack>
      <DeleteEventModal
        isOpen={isDeleteEventDialogOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="event"
      />
      <AddEventModal
        open={isAddEventDialogOpen}
        onClose={handleAddEventDialogClose}
        onConfirm={handleAddEvent}
      />
    </>
  );
};

export default CalendarEvents;