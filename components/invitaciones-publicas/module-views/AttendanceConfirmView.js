export default function AttendanceConfirmView({ data, styles, attendanceState }) {
  return (
    <section className={`${styles.moduleCard} ${styles.moduleCardRsvp}`}>
      <div className={styles.attendanceHeading}>
        <h2 className={styles.attendanceTitle}>{data.title}</h2>
      </div>
      <div className={styles.attendanceIntro}>
        <p className={styles.attendanceLead}>{data.helperText}</p>
      </div>
      <div className={styles.attendanceForm}>
        {attendanceState.guests.map((guest) => (
          <div key={guest.id} className={styles.attendanceRow}>
            <div className={styles.attendanceRowHeader}>
              <strong className={styles.attendanceGuestName}>
                {guest.principal ? <span className={styles.attendancePrimaryStar} aria-label="Principal">✦</span> : null}
                <span>{guest.nombre}</span>
              </strong>
            </div>
            <div className={styles.attendanceOptions} role="radiogroup" aria-label={`Confirmacion de ${guest.nombre}`}>
              {attendanceState.options.map((option) => {
                const active = Number(guest.confirmado || 0) === option.value;
                const inputId = `attendance-${guest.id}-${option.value}`;

                return (
                  <label
                    key={`${guest.id}-${option.value}`}
                    htmlFor={inputId}
                    className={`${styles.attendanceOption} ${active ? styles.attendanceOptionActive : ''}`}
                  >
                    <input
                      id={inputId}
                      className={styles.attendanceRadioInput}
                      type="radio"
                      name={`attendance-${guest.id}`}
                      checked={active}
                      onChange={(event) => attendanceState.onChange(event, guest.id, option.value)}
                      disabled={attendanceState.isSavingGuest(guest.id)}
                    />
                    <span className={styles.attendanceRadioMark} aria-hidden="true" />
                    <span className={styles.attendanceOptionLabel}>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
