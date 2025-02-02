export function getBarberStyles(styles) {
	return styles.join(", ")
}

export function getBarberStylesWithOr(styles) {
	if (styles.length <= 1) return styles.join("")
	return styles.slice(0, -1).join(", ") + " or " + styles[styles.length - 1]
}


export function formatBarberName(fullName) {
	if (fullName.length > 10) {
		return fullName.split(" ")[0]
	}
	return fullName
}

