import React, { useState } from "react";

export default function AddSlot({ onClose, onSlotAdded, baseUrl, chargers, initialChargerId }) {
    const [isBulk, setIsBulk] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        chargerId: initialChargerId || "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        slotType: "Standard",
        priceMultiplier: 1.0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const token = localStorage.getItem("token");
        const endpoint = isBulk ? "/slots/bulk" : "/slots";
        const payload = isBulk
            ? { chargerId: form.chargerId, date: form.date }
            : { ...form, chargerId: parseInt(form.chargerId) };

        try {
            const res = await fetch(`${baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert(isBulk ? "Slots generated successfully for the day!" : "Slot created successfully!");
                onSlotAdded();
            } else {
                const errText = await res.text();
                setError(`Failed to ${isBulk ? 'generate bulk slots' : 'create slot'}: ${errText}`);
            }
        } catch (err) {
            console.error("Submission error:", err);
            setError("An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={styles.heading}>{isBulk ? "Bulk Generate Slots" : "Add Single Slot"}</h2>
                <div style={styles.toggleContainer}>
                    <span style={{ fontSize: "12px", marginRight: "8px", color: "#666" }}>Bulk Mode</span>
                    <input
                        type="checkbox"
                        checked={isBulk}
                        onChange={(e) => setIsBulk(e.target.checked)}
                        style={styles.checkbox}
                    />
                </div>
            </div>

            {error && <div style={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label style={styles.label}>Charger</label>
                    <select
                        name="chargerId"
                        value={form.chargerId}
                        onChange={handleChange}
                        style={styles.select}
                        required
                    >
                        <option value="" disabled>Select a Charger</option>
                        {chargers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.ocppId || `ID: ${c.id}`} ({c.chargerType})
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>

                {!isBulk && (
                    <>
                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label style={styles.label}>Start Time</label>
                                <input
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>End Time</label>
                                <input
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </div>

                        <div style={styles.row}>
                            <div style={styles.field}>
                                <label style={styles.label}>Slot Type</label>
                                <select
                                    name="slotType"
                                    value={form.slotType}
                                    onChange={handleChange}
                                    style={styles.select}
                                >
                                    <option value="Standard">Standard</option>
                                    <option value="Peak">Peak Hour</option>
                                    <option value="Discounted">Discounted</option>
                                </select>
                            </div>
                            <div style={styles.field}>
                                <label style={styles.label}>Price Multiplier</label>
                                <input
                                    type="number"
                                    name="priceMultiplier"
                                    step="0.1"
                                    min="0.5"
                                    max="5.0"
                                    value={form.priceMultiplier}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                            </div>
                        </div>
                    </>
                )}

                <div style={styles.buttons}>
                    <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" style={styles.submitBtn} disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : isBulk ? "Generate Bulk" : "Create Slot"}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Lexend, sans-serif",
    },
    heading: {
        fontSize: "20px",
        fontWeight: "600",
        margin: 0,
    },
    toggleContainer: {
        display: "flex",
        alignItems: "center",
    },
    checkbox: {
        cursor: "pointer",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    row: {
        display: "flex",
        gap: "16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        flex: 1,
    },
    label: {
        fontSize: "13px",
        fontWeight: "500",
        color: "#444",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        outline: "none",
    },
    select: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        fontSize: "14px",
        backgroundColor: "white",
        outline: "none",
    },
    errorBox: {
        backgroundColor: "#FFE4E6",
        color: "#BE123C",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "13px",
        marginBottom: "16px",
    },
    buttons: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "8px",
    },
    cancelBtn: {
        padding: "10px 20px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        background: "transparent",
        cursor: "pointer",
        fontSize: "14px",
    },
    submitBtn: {
        padding: "10px 24px",
        borderRadius: "20px",
        border: "none",
        background: "#000",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
    },
};
