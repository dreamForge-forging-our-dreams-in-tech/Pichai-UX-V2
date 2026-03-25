async function get_fetch(url) { // global fetch function b ecause i was repeating myself in the Github Intergration.
    const response = await fetch(url);

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    return await response.json();
}

export { get_fetch }