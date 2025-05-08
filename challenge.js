let remaining_seconds = 1
let total_seconds = 0
let reps = {
  p1: 0,
  p2: 0,
  p3: 0,
  p4: 0
}

setInterval(second_passes, 1000)
let les_go = false

function on_load() {
  document.getElementById("name").value = ""
  document.getElementById("repetitions").value = ""
  document.getElementById("hours").value = "1"
  document.getElementById("minutes").value = "0"
  document.getElementById("seconds").value = "0"
  for (let i of ["2", "3", "4"]) {
    document.getElementById("participant_" + i + "_name").value = ""
    document.getElementById("participant_" + i + "_name").disabled = true
    document.getElementById("participant_" + i + "_color").value = "#FF0000"
    document.getElementById("participant_" + i + "_color").disabled = true
    document.getElementById("participant_" + i + "_remove").hidden = true
    document.getElementById("participant_" + i + "_add").hidden = false
  }
}

function toggle_participant(id, add) {
  if (add) {
    document.getElementById("participant_" + id + "_name").disabled = false
    document.getElementById("participant_" + id + "_color").disabled = false
    document.getElementById("participant_" + id + "_add").hidden = true
    document.getElementById("participant_" + id + "_remove").hidden = false
    document.getElementById("preview_participant_" + id).hidden = false

    document.getElementById("preview_participants").innerHTML = parseInt(document.getElementById("preview_participants").innerHTML) + 1
  } else {
    document.getElementById("participant_" + id + "_name").disabled = true
    document.getElementById("participant_" + id + "_name").value = ""
    document.getElementById("participant_" + id + "_color").disabled = true
    document.getElementById("participant_" + id + "_add").hidden = false
    document.getElementById("participant_" + id + "_remove").hidden = true
    document.getElementById("preview_participant_" + id).hidden = true

    document.getElementById("preview_participants").innerHTML = parseInt(document.getElementById("preview_participants").innerHTML) - 1
  }
}

function update_time() {
  document.getElementById("preview_time").innerHTML = document.getElementById("hours").value + "h " + document.getElementById("minutes").value + "m " + document.getElementById("seconds").value + "s"
}

function start() {
  let stop1 = false
  let stop2 = false
  let stop3 = false
  let stop4 = false
  let stop5 = false
  let stop6 = false
  let stop7 = false
  document.getElementById("name").value === "" ? window.alert("You must enter the name of the challenge!") : stop1 = true
  document.getElementById("participant_1_name").value === "" ? window.alert("You must enter the name of participant 1!") : stop2 = true
  document.getElementById("participant_2_name").value === "" && document.getElementById("participant_2_name").disabled === false ? window.alert("You must enter the name of participant 2!") : stop3 = true
  document.getElementById("participant_3_name").value === "" && document.getElementById("participant_3_name").disabled === false ? window.alert("You must enter the name of participant 3!") : stop4 = true
  document.getElementById("participant_4_name").value === "" && document.getElementById("participant_4_name").disabled === false ? window.alert("You must enter the name of participant 4!") : stop5 = true
  document.getElementById("repetitions").value === "" ? window.alert("You must enter the repetition goal!") : stop6 = true
  document.getElementById("hours").value === "0" && document.getElementById("minutes").value < 5 ? window.alert("The challenge must last at least five minutes!") : stop7 = true

  if (!(stop1 && stop2 && stop3 && stop4 && stop5 && stop6 && stop7)) { return } else {
    les_go = true

    if (document.getElementById("preview_participants").innerHTML === "1") {
      document.getElementById("individual_rep_percentage").hidden = true
    }

    document.getElementById("settings").hidden = true
    document.getElementById("challenge").hidden = false

    document.getElementById("display_name").innerHTML = document.getElementById("name").value
    remaining_seconds = parseInt(document.getElementById("seconds").value) + parseInt(document.getElementById("minutes").value) * 60 + parseInt(document.getElementById("hours").value) * 3600 - 1

    total_seconds = parseInt(remaining_seconds)

    document.getElementById("display_total_reps").innerHTML = document.getElementById("repetitions").value

    document.getElementById("target_rpm").innerHTML = (60 / (total_seconds / parseInt(document.getElementById("repetitions").value))).toFixed(1)

    let hours = Math.floor(remaining_seconds / 3600)
    let minutes = Math.floor(remaining_seconds / 60) % 60
    let seconds = remaining_seconds % 60
    document.getElementById("display_remaining_time").innerHTML = hours + "h " + minutes + "m " + seconds + "s"

    for (let i of ["1", "2", "3", "4"]) {
      if (!document.getElementById("participant_" + i + "_name").disabled) {
        document.getElementById("participant_" + i + "_rep_button").style.backgroundColor = document.getElementById("participant_" + i + "_color").value

        document.getElementById("participant_" + i + "_rep_button").style.borderColor = document.getElementById("participant_" + i + "_color").value

        document.getElementById("display_participant_" + i + "_color").style.color = document.getElementById("participant_" + i + "_color").value
        document.getElementById("display_participant_" + i + "_name").innerHTML = document.getElementById("participant_" + i + "_name").value

        document.getElementById("participant_" + i + "_progress_color").style.backgroundColor = document.getElementById("participant_" + i + "_color").value

        document.getElementById("name_participant_" + i).innerHTML = document.getElementById("participant_" + i + "_name").value
      } else {
        document.getElementById("participant_" + i + "_rep_button").hidden = true
        for (let j of document.getElementsByName("participant_" + i + "_element")) {
          j.hidden = true
        }
        document.getElementById("participant_" + i + "_progress").hidden = true
      }
    }
  }
}

function second_passes() {

  if (!les_go) {
    return
  } else if (remaining_seconds <= 0) {
    les_go = false
    document.getElementById("status").innerHTML = "finished"
    document.getElementById("display_remaining_time").innerHTML = "0h 0m 0s"
    for (let i of ["1", "2", "3", "4"]) {
      document.getElementById("participant_" + i + "_rep_button").hidden = true
    }
    document.getElementById("progressing").hidden = true
    document.getElementById("failure").hidden = false
    return
  }

  let hours = Math.floor(remaining_seconds / 3600)
  let minutes = Math.floor(remaining_seconds / 60) % 60
  let seconds = remaining_seconds % 60
  document.getElementById("display_remaining_time").innerHTML = hours + "h " + minutes + "m " + seconds + "s"
  remaining_seconds--

  let percent2 = ((total_seconds - remaining_seconds) / total_seconds * 100).toFixed(1) + "%"
  document.getElementById("time_progress").style.width = percent2
  document.getElementById("time_percentage").innerHTML = percent2

  update_rep_difference()
}

function rep(participant) {
  reps["p" + participant]++

  let total = 0

  for (let i of Object.keys(reps)) {
    total += reps[i]
  }

  document.getElementById("display_done_reps").innerHTML = total
  let percent = (total / parseInt(document.getElementById("repetitions").value) * 100).toFixed(1) + "%"
  document.getElementById("rep_progress").style.width = percent
  document.getElementById("rep_percentage").innerHTML = percent

  for (let i of ["1", "2", "3", "4"]) {
    let percentage = (reps["p" + i] / total * 100).toFixed(1) + "%"
    document.getElementById("participant_" + i + "_progress").style.width = percentage

    document.getElementById("participant_" + i + "_individual_percentage").innerHTML = percentage

    document.getElementById("rep_count_participant_" + i).innerHTML = reps["p" + i]
  }

  if (total >= parseInt(document.getElementById("repetitions").value)) {
    document.getElementById("progressing").hidden = true
    document.getElementById("success").hidden = false
    les_go = false
    document.getElementById("status").innerHTML = "finished"
    document.getElementById("display_remaining_time").innerHTML = "0h 0m 0s"
    for (let i of ["1", "2", "3", "4"]) {
      document.getElementById("participant_" + i + "_rep_button").hidden = true
    }
  }

  update_rep_difference()
}

function update_rep_difference() {
  let rep_total = 0
  for (let i of Object.keys(reps)) {
    rep_total += reps[i]
  }

  let seconds_per_rep = parseFloat((total_seconds / parseInt(document.getElementById("repetitions").value)).toFixed(1))
  if (seconds_per_rep * rep_total < total_seconds - remaining_seconds) {
    document.getElementById("ahead").hidden = true
    document.getElementById("behind").hidden = false
  } else {
    document.getElementById("ahead").hidden = false
    document.getElementById("behind").hidden = true
  }

  let rep_difference = rep_total - Math.round((total_seconds - remaining_seconds) / seconds_per_rep)

  document.getElementById("display_rep_advantage").innerHTML = rep_difference.toString().replace("-", "") + " reps"

  if (rep_difference > 0) {
    document.getElementById("display_rep_advantage").setAttribute("class", "text-success")
  } else if (rep_difference == 0) {
    document.getElementById("display_rep_advantage").setAttribute("class", "text-dark")
  } else {
    document.getElementById("display_rep_advantage").setAttribute("class", "text-danger")
  }

  let time_difference = Math.round(rep_total * seconds_per_rep - (total_seconds - remaining_seconds))

  let edible_seconds = parseInt(time_difference.toString().replace("-", ""))

  let hours = Math.floor(edible_seconds / 3600)
  let minutes = Math.floor(edible_seconds / 60) % 60
  let seconds = edible_seconds % 60

  let time_difference_text = ""

  if (hours !== 0) {
    time_difference_text = hours + " hours, " + minutes + " minutes and " + seconds + " seconds"
  } else {
    if (minutes !== 0) {
      time_difference_text = minutes + " minutes and " + seconds + " seconds"
    } else {
      time_difference_text = seconds + " seconds"
    }
  }

  document.getElementById("display_time_advantage").innerHTML = time_difference_text

  if (time_difference > 0) {
    document.getElementById("display_time_advantage").setAttribute("class", "text-success")
  } else if (time_difference == 0) {
    document.getElementById("display_time_advantage").setAttribute("class", "text-dark")
  } else {
    document.getElementById("display_time_advantage").setAttribute("class", "text-danger")
  }

  if (total_seconds - remaining_seconds > 120) {
    document.getElementById("estimates").hidden = false
    document.getElementById("not_shown_yet").hidden = true
  }
  document.getElementById("estimated_reps").innerHTML = Math.round(total_seconds / ((total_seconds - remaining_seconds) / rep_total))
  document.getElementById("reps_per_minute").innerHTML = (60 / ((total_seconds - remaining_seconds) / rep_total)).toFixed(1)
}