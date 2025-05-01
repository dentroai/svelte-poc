<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import { cn } from "$lib/utils"; // Assuming you have shadcn utils setup

  // Svelte 5 runes for state management
  let messages = $state<{ role: 'user' | 'assistant'; content: string }[]>([]);
  let currentInput = $state("");
  let isLoading = $state(false);
  let scrollAreaComponent = $state<any>(null);
  let viewportElement = $state<HTMLElement | null>(null);

  // Find viewport element when component mounts/updates
  $effect(() => {
    if (scrollAreaComponent?.$$) { // Check if component instance is valid
        // Try to find the viewport using a common selector for bits-ui/radix based components
        const viewport = scrollAreaComponent.$$.ctx.root.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport instanceof HTMLElement) {
            viewportElement = viewport;
        }
    }
  });

  async function sendMessage() {
    const userInput = currentInput;
    if (!userInput.trim()) return; // Don't send empty messages

    messages.push({ role: 'user', content: userInput });
    currentInput = "";
    isLoading = true;
    messages.push({ role: 'assistant', content: "" });

    // Scroll down immediately
    if (viewportElement) {
      // Give DOM a tick to update before scrolling
      await Promise.resolve();
      viewportElement.scrollTop = viewportElement.scrollHeight;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messages.slice(0, -1) }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let assistantMessageIndex = messages.length - 1;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: true });
        messages[assistantMessageIndex].content += chunk;
        messages = messages; // Trigger reactivity

        // Scroll to bottom as content arrives
         if (viewportElement) {
           viewportElement.scrollTop = viewportElement.scrollHeight;
         }
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      messages[messages.length - 1].content = `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`;
    } finally {
      isLoading = false;
       // Final scroll to bottom
       if (viewportElement) {
         viewportElement.scrollTop = viewportElement.scrollHeight;
       }
    }
  }

  // Effect to scroll down when messages change (primarily for initial load or external changes)
  $effect(() => {
    if (viewportElement) {
        // Delay slightly for DOM updates
        setTimeout(() => {
           viewportElement!.scrollTop = viewportElement!.scrollHeight;
        }, 50); // Increased delay slightly
    }
  });

</script>

<div class="flex flex-col h-screen p-4">
  <h1 class="text-2xl font-bold mb-4 text-center">Minimal Chatbot</h1>

  <ScrollArea class="flex-grow mb-4 border rounded-md p-4" bind:this={scrollAreaComponent}>
    <div class="space-y-4">
      {#each messages as message, i (i)}
        <div class={cn(
            "flex max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm break-words",
            message.role === 'user' ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {message.content}
        </div>
      {/each}
      {#if isLoading && messages[messages.length - 1]?.role === 'assistant'}
         <!-- Optional: subtle loading indicator on the last message -->
         <div class="animate-pulse text-muted-foreground text-sm">...</div>
      {/if}
    </div>
  </ScrollArea>

  <form onsubmit={sendMessage} class="flex gap-2">
    <Input
      bind:value={currentInput}
      placeholder="Type your message..."
      class="flex-grow"
      disabled={isLoading}
    />
    <Button type="submit" disabled={isLoading}>
      {#if isLoading}
        Loading...
      {:else}
        Send
      {/if}
    </Button>
  </form>
</div>
