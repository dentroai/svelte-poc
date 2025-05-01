<script lang="ts">
    let hardcodedTimestamp = "2025-05-01"

    import { compareAsc, format, formatDistanceToNow } from "date-fns";
    // import { onMount } from 'svelte';

    const dates = [
    new Date(1995, 6, 2),
    new Date(1987, 1, 11),
    new Date(1989, 6, 10),
    ];
    let sortedDates = dates.sort(compareAsc);

    // Parse the hardcoded string into a Date object
    const targetDate = new Date(hardcodedTimestamp);

    // Calculate the distance and add the suffix (e.g., "ago" or "in")
    let timeDistance = formatDistanceToNow(targetDate, { addSuffix: true });
</script>


<h1>Can we get DateFNS to work?</h1>
<br>
<p> Hardcoded timestamp is {hardcodedTimestamp} </p>
<p> The sorted dates are {sortedDates} </p>
<p> The hardcoded date is {timeDistance} </p>
<br>
<p>Steps taken to make it work:</p>
<li><code>bun install date-fns --save</code></li>
<li>Use the code in script tag.</li>