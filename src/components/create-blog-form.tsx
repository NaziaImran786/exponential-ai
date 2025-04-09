// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { format } from "date-fns"
// import { CalendarIcon, Loader2, CheckCircle2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
// import { ImageUpload } from "@/components/image-upload"
// import { RichTextEditor } from "@/components/rich-text-editor"
// import { createBlogPost } from "@/lib/actions"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle } from "lucide-react"

// const formSchema = z.object({
//   id: z.coerce.number().positive("Blog ID must be a positive number"),
//   title: z.string().min(2, "Title must be at least 2 characters"),
//   subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
//   date: z.date({
//     required_error: "Please select a date",
//   }),
//   author: z.string().min(2, "Author name must be at least 2 characters"),
//   category: z.string().min(2, "Category must be at least 2 characters"),
//   image: z.string().optional(),
//   description: z.any().optional(),
// })

// export function CreateBlogForm() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formError, setFormError] = useState<string | null>(null)
//   const [formSuccess, setFormSuccess] = useState<string | null>(null)
//   const [isLocalSave, setIsLocalSave] = useState(false)

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       id: undefined,
//       title: "",
//       subtitle: "",
//       date: new Date(),
//       author: "",
//       category: "",
//       image: "",
//       description: { text: "" },
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     try {
//       setIsSubmitting(true)
//       setFormError(null)
//       setFormSuccess(null)
//       setIsLocalSave(false)

//       // Check if image is a data URL (these can be very large)
//       if (values.image && values.image.startsWith("data:")) {
//         console.log("Image is a data URL - this might be too large for Sanity")
//       }

//       const response = await createBlogPost(values)

//       // Check if it's a local save (fallback)
//       if (response && response._id && response._id.startsWith("local-")) {
//         setIsLocalSave(true)
//         setFormSuccess("Blog post saved locally. Note: This is a preview mode only.")

//         // Store in localStorage for demo purposes
//         const existingPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]")
//         localStorage.setItem("blogPosts", JSON.stringify([...existingPosts, { ...values, id: Date.now() }]))

//         // Don't redirect in local save mode
//       } else {
//         // Normal save to Sanity
//         setFormSuccess("Blog post created successfully!")

//         // Wait a moment to show success message before redirecting
//         setTimeout(() => {
//           router.push("/blog")
//           router.refresh()
//         }, 1500)
//       }
//     } catch (error) {
//       console.error("Error creating blog post:", error)
//       setFormError(error instanceof Error ? error.message : "Failed to create blog post")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         {formError && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{formError}</AlertDescription>
//           </Alert>
//         )}

//         {formSuccess && (
//           <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
//             <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
//             <AlertDescription className="text-green-600 dark:text-green-400">
//               {formSuccess}
//               {isLocalSave && (
//                 <span className="block mt-1 text-sm">Sanity connection unavailable. Data saved in browser only.</span>
//               )}
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             control={form.control}
//             name="id"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Blog ID</FormLabel>
//                 <FormControl>
//                   <Input type="number" placeholder="Enter blog ID" {...field} />
//                 </FormControl>
//                 <FormDescription>A unique identifier for your blog post</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="date"
//             render={({ field }) => (
//               <FormItem className="flex flex-col">
//                 <FormLabel>Date</FormLabel>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant={"outline"}
//                         className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
//                       >
//                         {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
//                         <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0" align="start">
//                     <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
//                   </PopoverContent>
//                 </Popover>
//                 <FormDescription>The publication date of your blog post</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter blog title" {...field} />
//               </FormControl>
//               <FormDescription>The main title of your blog post</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="subtitle"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Subtitle</FormLabel>
//               <FormControl>
//                 <Input placeholder="Enter blog subtitle" {...field} />
//               </FormControl>
//               <FormDescription>A brief subtitle or tagline for your post</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormField
//             control={form.control}
//             name="author"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Author</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter author name" {...field} />
//                 </FormControl>
//                 <FormDescription>The name of the blog post author</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="category"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Category</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Enter blog category" {...field} />
//                 </FormControl>
//                 <FormDescription>The category this blog post belongs to</FormDescription>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>

//         <FormField
//           control={form.control}
//           name="image"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Featured Image</FormLabel>
//               <FormControl>
//                 <ImageUpload value={field.value} onChange={field.onChange} />
//               </FormControl>
//               <FormDescription>Upload a featured image for your blog post</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <RichTextEditor value={field.value} onChange={field.onChange} />
//               </FormControl>
//               <FormDescription>The main content of your blog post</FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" disabled={isSubmitting} className="w-full gradient-bg">
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Submitting...
//             </>
//           ) : (
//             "Create Blog Post"
//           )}
//         </Button>
//       </form>
//     </Form>
//   )
// }
